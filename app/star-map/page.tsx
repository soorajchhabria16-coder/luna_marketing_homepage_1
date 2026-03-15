"use client";

import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';

interface Star {
  radius: number;
  angle: number;
  size: number;
  baseAlpha: number;
  colorPrefix: string;
  twinkleSpeed: number;
  twinklePhase: number;
  x: number;
  y: number;
}

export default function StarMapPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [drawConstellations, setDrawConstellations] = useState(true);
  const [speedMode, setSpeedMode] = useState(1); // 1: normal, 2: fast, 3: warp

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let centerX = width / 2;
    let centerY = height / 2;
    let rotationAngle = 0;
    let rotationSpeed = 0.0003;
    const mouse = { x: -1000, y: -1000, radius: 250 };
    const stars: Star[] = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
      centerX = width / 2;
      centerY = height / 2;
    }

    window.addEventListener('resize', resize);
    resize();

    // Create stars
    const numStars = width > 900 ? 700 : 350;
    for (let i = 0; i < numStars; i++) {
      const radius = Math.random() * Math.random() * Math.max(width, height) * 1.5;
      const angle = Math.random() * Math.PI * 2;
      let size = Math.random() * 1.2 + 0.5;
      if (Math.random() > 0.97) size += 2;
      
      let colorPrefix = 'rgba(255, 255, 255, ';
      const colorType = Math.random();
      if (colorType > 0.8) colorPrefix = 'rgba(248, 207, 156, ';
      else if (colorType > 0.6) colorPrefix = 'rgba(167, 139, 250, ';

      stars.push({
        radius,
        angle,
        size,
        baseAlpha: Math.random() * 0.6 + 0.2,
        colorPrefix,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        x: 0,
        y: 0
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = '#080914';
      ctx.fillRect(0, 0, width, height);

      // Speed logic
      if (speedMode === 1) rotationSpeed = 0.0004;
      else if (speedMode === 2) rotationSpeed = 0.002;
      else rotationSpeed = 0.008;

      if (isRotating) {
        rotationAngle += rotationSpeed;
      }

      const visibleStars: Star[] = [];

      stars.forEach(star => {
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.4;
        const clampedAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        const currentAngle = star.angle + rotationAngle;
        star.x = centerX + Math.cos(currentAngle) * star.radius;
        star.y = centerY + Math.sin(currentAngle) * star.radius * 0.6; // 3D tilt

        if (star.x > -100 && star.x < width + 100 && star.y > -100 && star.y < height + 100) {
          visibleStars.push(star);

          // Star glow
          if (star.size > 1.5) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = star.colorPrefix + (clampedAlpha * 0.15) + ')';
            ctx.fill();
          }

          // Star core
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = star.colorPrefix + clampedAlpha + ')';
          ctx.fill();
        }
      });

      if (drawConstellations) {
        ctx.lineWidth = 0.7;
        for (let i = 0; i < visibleStars.length; i++) {
          const s1 = visibleStars[i];

          // Mouse attraction & lines
          const dx = s1.x - mouse.x;
          const dy = s1.y - mouse.y;
          const distMouse = Math.sqrt(dx * dx + dy * dy);

          if (distMouse < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(248, 207, 156, ${(1 - distMouse / mouse.radius) * 0.4})`;
            ctx.stroke();

            // Pull stars slightly
            s1.x += (mouse.x - s1.x) * 0.03;
            s1.y += (mouse.y - s1.y) * 0.03;
          }

          // Inters-star connections
          let connections = 0;
          for (let j = i + 1; j < visibleStars.length; j++) {
            if (connections > 2) break;
            const s2 = visibleStars[j];
            const dist = Math.sqrt(Math.pow(s2.x - s1.x, 2) + Math.pow(s2.y - s1.y, 2));
            if (dist < 70) {
              ctx.beginPath();
              ctx.moveTo(s1.x, s1.y);
              ctx.lineTo(s2.x, s2.y);
              ctx.strokeStyle = `rgba(167, 139, 250, ${(1 - dist / 70) * 0.2})`;
              ctx.stroke();
              connections++;
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [isRotating, drawConstellations, speedMode]);

  return (
    <div className="star-map-main">
      <Navbar />

      <section className="star-map-container">
        <canvas ref={canvasRef} id="starMapCanvas"></canvas>
        
        <div className="star-map-ui reveal active">
          <h1>Celestial Map</h1>
          <p>Explore the cosmic tapestry. Guide the stellar energies with your presence and watch as new constellations align in your journey through the void.</p>
        </div>

        <div className="map-controls reveal active">
          <button 
            className={`control-btn ${!isRotating ? 'active' : ''}`} 
            onClick={() => setIsRotating(!isRotating)}
          >
            <i className={`fa-solid ${isRotating ? 'fa-pause' : 'fa-play'}`}></i> 
            {isRotating ? 'Pause' : 'Play'}
          </button>
          
          <button 
            className={`control-btn ${drawConstellations ? 'active' : ''}`} 
            onClick={() => setDrawConstellations(!drawConstellations)}
          >
            <i className={`fa-solid ${drawConstellations ? 'fa-project-diagram' : 'fa-eye-slash'}`}></i> 
            Constellations
          </button>
          
          <button 
            className={`control-btn ${speedMode === 2 ? 'fast' : speedMode === 3 ? 'warp' : ''}`} 
            onClick={() => setSpeedMode((speedMode % 3) + 1)}
          >
            <i className={`fa-solid ${speedMode === 3 ? 'fa-shuttle-space' : 'fa-forward'}`}></i> 
            {speedMode === 1 ? 'Normal' : speedMode === 2 ? 'Fast' : 'Warp'}
          </button>
        </div>
      </section>
    </div>
  );
}
