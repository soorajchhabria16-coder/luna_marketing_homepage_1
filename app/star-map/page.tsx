"use client";

import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Navbar from '../components/Navbar';
import { GlassCard, CosmicButton, Badge } from '../components/ui/CosmicUI';

interface Star {
  x: number;
  y: number;
  z: number; // Layer/Depth: 1 foreground, 2 mid, 3 bg
  size: number;
  baseAlpha: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface CelestialBody {
  x: number;
  y: number;
  name: string;
  description: string;
  type: string;
  color: string;
}

const PageRoot = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #05060b;
`;

const StarCanvas = styled.canvas`
  cursor: move;
`;

const UIOverlay = styled.div`
  position: absolute;
  top: 100px;
  left: 30px;
  pointer-events: none;
  max-width: 350px;
  z-index: 10;
`;

const OverlayTitle = styled.h1`
  font-size: 2.5rem;
  margin-top: 15px;
`;

const OverlayText = styled.p`
  color: var(--text-dim);
  font-size: 0.9rem;
  margin-top: 10px;
`;

const ControlPanel = styled(GlassCard)`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  padding: 15px 30px;
  pointer-events: auto;
  z-index: 10;
  
  @media (max-width: 768px) {
    width: calc(100% - 40px);
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const ZoomIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-right: 15px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

const IndicatorLabel = styled.span`
  font-size: 0.7rem;
  color: var(--text-dim);
`;

const IndicatorValue = styled.b`
  color: var(--gold-accent);
  min-width: 35px;
`;

const ControlActionLabel = styled.span`
  margin-left: 10px;
`;

const DiscoveryCard = styled(GlassCard)`
  position: absolute;
  top: 100px;
  right: 30px;
  width: 300px;
  z-index: 10;
  pointer-events: auto;
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &.visible {
    opacity: 1;
    transform: translateX(0);
  }
`;

const DiscoveryTitle = styled.h3<{ color?: string }>`
  margin: 10px 0;
  color: ${props => props.color || 'inherit'};
`;

const DiscoveryText = styled.p`
  font-size: 0.85rem;
  color: var(--text-dim);
  line-height: 1.6;
`;

const DiscoveryButton = styled(CosmicButton)`
  width: 100%;
  margin-top: 20px;
`;

const Crosshair = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(248, 207, 156, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 5;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: rgba(248, 207, 156, 0.5);
  }
  &::before { top: 50%; left: -10px; right: -10px; height: 1px; }
  &::after { left: 50%; top: -10px; bottom: -10px; width: 1px; }
`;

export default function StarMapPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(true);
  const [discovery, setDiscovery] = useState<CelestialBody | null>(null);
  
  // Internal animation state
  const state = useRef({
    stars: [] as Star[],
    bodies: [] as CelestialBody[],
    rotation: 0,
    isDragging: false,
    lastMouse: { x: 0, y: 0 }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize Stars & Bodies
    if (state.current.stars.length === 0) {
      const starColors = ['#ffffff', '#f8cf9c', '#a78bfa', '#60a5fa'];
      for (let i = 0; i < 1200; i++) {
        state.current.stars.push({
          x: (Math.random() - 0.5) * 4000,
          y: (Math.random() - 0.5) * 4000,
          z: Math.random() < 0.1 ? 1 : Math.random() < 0.3 ? 2 : 3,
          size: Math.random() * 1.5 + 0.2,
          baseAlpha: Math.random() * 0.7 + 0.2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          twinkleSpeed: Math.random() * 0.05 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }
      
      state.current.bodies = [
        { x: 200, y: -400, name: "Sirius A", type: "Binary Star", color: "#60a5fa", description: "The brightest star in the night sky. In LUNA, it signals a phase of high spiritual clarity and manifestation potency." },
        { x: -800, y: 300, name: "Pleiades Cluster", type: "Star Cluster", color: "#a78bfa", description: "The Seven Sisters. A celestial beacon for collective healing and ancestral wisdom." },
        { x: 1200, y: 1200, name: "Nebula Orionis", type: "Stellar Nursery", color: "#f8cf9c", description: "Where stars are born. This region represents the raw creative spark currently influencing your chart." },
        { x: -300, y: -900, name: "Polaris", type: "Navigational Pivot", color: "#ffffff", description: "The North Star. Your internal compass is currently aligning with this steadfast frequency." }
      ];
    }

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = '#05060b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      if (isRotating) state.current.rotation += 0.00015;

      // Draw Layers
      state.current.stars.forEach(star => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3;
        
        // Calculate position with rotation and offset
        const rotX = star.x * Math.cos(state.current.rotation) - star.y * Math.sin(state.current.rotation);
        const rotY = star.x * Math.sin(state.current.rotation) + star.y * Math.cos(state.current.rotation);
        
        // Apply zoom and user pan offset
        const x = cx + (rotX + offset.x) * (zoom / star.z);
        const y = cy + (rotY + offset.y) * (zoom / star.z);

        if (x > -50 && x < canvas.width + 50 && y > -50 && y < canvas.height + 50) {
          ctx.beginPath();
          ctx.arc(x, y, star.size * (zoom > 1 ? 1 + (zoom-1)*0.2 : 1), 0, Math.PI * 2);
          ctx.fillStyle = star.color + Math.floor((star.baseAlpha + twinkle) * 255).toString(16).padStart(2, '0');
          ctx.fill();
        }
      });

      // Draw Celestial Bodies
      state.current.bodies.forEach(body => {
        const rotX = body.x * Math.cos(state.current.rotation) - body.y * Math.sin(state.current.rotation);
        const rotY = body.x * Math.sin(state.current.rotation) + body.y * Math.cos(state.current.rotation);
        
        const x = cx + (rotX + offset.x) * zoom;
        const y = cy + (rotY + offset.y) * zoom;

        if (x > -100 && x < canvas.width + 100 && y > -100 && y < canvas.height + 100) {
          // Glow effect
          const grad = ctx.createRadialGradient(x, y, 0, x, y, 40 * zoom);
          grad.addColorStop(0, body.color + '44');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, 40 * zoom, 0, Math.PI * 2);
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(x, y, 4 * zoom, 0, Math.PI * 2);
          ctx.fillStyle = body.color;
          ctx.fill();

          // Label if close to center
          const distToCenter = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
          if (distToCenter < 100) {
            ctx.fillStyle = '#fff';
            ctx.font = '12px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText(body.name, x, y + 25 * zoom);
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(prev => Math.max(0.2, Math.min(5, prev - e.deltaY * 0.001)));
    };

    const handleMouseDown = (e: MouseEvent) => {
      state.current.isDragging = true;
      state.current.lastMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!state.current.isDragging) return;
      const dx = (e.clientX - state.current.lastMouse.x) / zoom;
      const dy = (e.clientY - state.current.lastMouse.y) / zoom;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      state.current.lastMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      state.current.isDragging = false;
      
      // Check for discovery
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      let found = null;
      
      for (const body of state.current.bodies) {
        const rotX = body.x * Math.cos(state.current.rotation) - body.y * Math.sin(state.current.rotation);
        const rotY = body.x * Math.sin(state.current.rotation) + body.y * Math.cos(state.current.rotation);
        const x = cx + (rotX + offset.x) * zoom;
        const y = cy + (rotY + offset.y) * zoom;
        const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        if (dist < 50) {
          found = body;
          break;
        }
      }
      setDiscovery(found);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoom, offset, isRotating]);

  return (
    <PageRoot>
      <Navbar />
      <StarCanvas ref={canvasRef} />
      <Crosshair />
      
      <UIOverlay>
        <Badge>VOYAGER MODE</Badge>
        <OverlayTitle>Celestial Map</OverlayTitle>
        <OverlayText>
          Drag to pan through the cosmos. Scroll to zoom deep into stellar nurseries. Align bodies with the crosshair to decode their wisdom.
        </OverlayText>
      </UIOverlay>

      <DiscoveryCard className={discovery ? 'visible' : ''}>
        {discovery && (
          <>
            <Badge>{discovery.type}</Badge>
            <DiscoveryTitle color={discovery.color}>{discovery.name}</DiscoveryTitle>
            <DiscoveryText>{discovery.description}</DiscoveryText>
            <DiscoveryButton onClick={() => setDiscovery(null)}>SYNC VIBRATION</DiscoveryButton>
          </>
        )}
      </DiscoveryCard>

      <ControlPanel>
        <ZoomIndicator>
          <IndicatorLabel>ZOOM</IndicatorLabel>
          <IndicatorValue>{(zoom * 100).toFixed(0)}%</IndicatorValue>
        </ZoomIndicator>
        
        <CosmicButton onClick={() => setIsRotating(!isRotating)}>
          <i className={`fa-solid ${isRotating ? 'fa-pause' : 'fa-play'}`}></i>
          <ControlActionLabel>{isRotating ? 'Stop Drift' : 'Resume Drift'}</ControlActionLabel>
        </CosmicButton>

        <CosmicButton onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}>
          RESET VIEW
        </CosmicButton>
      </ControlPanel>
    </PageRoot>
  );
}
