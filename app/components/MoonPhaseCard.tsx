"use client";

import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { GlassCard, GradientText, Badge } from './ui/CosmicUI';

const pulse = keyframes`
  0%, 100% { filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.4)); }
  50% { filter: drop-shadow(0 0 25px rgba(167, 139, 250, 0.8)); }
`;

const MoonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 10px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const MoonCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #fff 0%, #cbd5e0 40%, #2d3748 100%);
  position: relative;
  overflow: hidden;
  box-shadow: inset -10px -10px 20px rgba(0,0,0,0.5);
  animation: ${pulse} 5s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    border-radius: 50%;
    transform: translateX(40%); /* Mocking a phase */
  }
`;

const MoonInfo = styled.div`
  flex: 1;
`;

const PhaseTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 2rem;
  margin-bottom: 8px;
`;

const MoonPhaseCard = () => {
  return (
    <GlassCard style={{ marginTop: '32px' }}>
      <MoonWrapper>
        <MoonCircle />
        <MoonInfo>
          <Badge>LUNAR CYCLE</Badge>
          <PhaseTitle>Waxing Gibbous</PhaseTitle>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
            A period of refinement and gestation. Focus on finishing what you've started and polishing your recent projects before the Full Moon illumination.
          </p>
          <div style={{ marginTop: '15px', display: 'flex', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--purple-accent)', textTransform: 'uppercase' }}>Illumination</div>
              <div style={{ fontSize: '1.2rem' }}>84%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--purple-accent)', textTransform: 'uppercase' }}>Next Full Moon</div>
              <div style={{ fontSize: '1.2rem' }}>3 Days</div>
            </div>
          </div>
        </MoonInfo>
      </MoonWrapper>
    </GlassCard>
  );
};

export default MoonPhaseCard;
