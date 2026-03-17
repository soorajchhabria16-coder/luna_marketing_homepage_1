"use client";

import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { GlassCard } from './ui/CosmicUI';

const glow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 5px rgba(248, 207, 156, 0.3)); }
  50% { filter: drop-shadow(0 0 15px rgba(248, 207, 156, 0.6)); }
`;

const IdentityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const IdentityCard = styled(GlassCard)`
  text-align: center;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--gold-accent);
  }
`;

const IconCircle = styled.div<{ color?: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(248, 207, 156, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${props => props.color || 'var(--gold-accent)'};
  border: 1px solid rgba(248, 207, 156, 0.2);
  animation: ${glow} 3s ease-in-out infinite;
`;

const SignName = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  margin: 0;
  color: #fff;
`;

const PlacementType = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-dim);
`;

const Degree = styled.span`
  font-size: 0.8rem;
  font-weight: 300;
  color: var(--purple-accent);
  opacity: 0.8;
`;

interface CosmicIdentityProps {
  sun: string;
  moon: string;
  rising: string;
}

const CosmicIdentity = ({ sun, moon, rising }: CosmicIdentityProps) => {
  return (
    <IdentityGrid>
      <IdentityCard>
        <PlacementType>Your Sun</PlacementType>
        <IconCircle color="#f6e05e">
           <i className="fa-solid fa-sun"></i>
        </IconCircle>
        <SignName>{sun}</SignName>
        <Degree>15° {sun}</Degree>
      </IdentityCard>

      <IdentityCard>
        <PlacementType>Your Moon</PlacementType>
        <IconCircle color="#cbd5e0">
           <i className="fa-solid fa-moon"></i>
        </IconCircle>
        <SignName>{moon}</SignName>
        <Degree>22° {moon}</Degree>
      </IdentityCard>

      <IdentityCard>
        <PlacementType>Your Rising</PlacementType>
        <IconCircle color="#a78bfa">
           <i className="fa-solid fa-circle-up"></i>
        </IconCircle>
        <SignName>{rising}</SignName>
        <Degree>4° {rising}</Degree>
      </IdentityCard>
    </IdentityGrid>
  );
};

export default CosmicIdentity;
