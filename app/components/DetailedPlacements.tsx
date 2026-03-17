"use client";

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { GlassCard, Badge, CosmicButton } from './ui/CosmicUI';

interface Placement {
  name: string;
  sign: string;
  house: string;
  icon: string;
  color: string;
  insight: string;
}

const PlacementsContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PlacementTitle = styled.h4`
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 0.8rem;
  opacity: 0.6;
`;

const PlacementRow = styled(GlassCard)`
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(248, 207, 156, 0.3);
  }
`;

const RowContent = styled.div`
  display: flex;
  align-items: center;
`;

const PlanetIcon = styled.div<{ color: string; large?: boolean }>`
  width: ${props => props.large ? '60px' : '40px'};
  height: ${props => props.large ? '60px' : '40px'};
  border-radius: 50%;
  border: 1px solid ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.large ? '2rem' : '1.2rem'};
  color: ${props => props.color};
  background: rgba(255, 255, 255, 0.02);
  margin: ${props => props.large ? '0 auto 20px' : '0'};
`;

const PlacementText = styled.div`
  flex: 1;
  margin-left: 15px;
  
  & b {
    display: block;
    font-size: 0.95rem;
  }
  & span {
    font-size: 0.8rem;
    color: var(--text-dim);
  }
`;

const ChevronIcon = styled.i`
  opacity: 0.3;
`;

const InsightModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled(GlassCard)`
  max-width: 500px;
  width: 100%;
  padding: 40px;
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin: 15px 0;
`;

const ModalInsight = styled.p`
  color: var(--text-dim);
  line-height: 1.6;
  margin-bottom: 30px;
`;

const DetailedPlacements = () => {
  const [selected, setSelected] = useState<Placement | null>(null);

  const placements: Placement[] = [
    { name: 'Sun', sign: 'Leo', house: '10th House', icon: 'fa-regular fa-sun', color: 'var(--gold-accent)', insight: 'Your Sun in Leo in the 10th House suggests a powerful drive for public recognition and creative leadership. You are born to shine in your career and authority roles.' },
    { name: 'Moon', sign: 'Scorpio', house: '1st House', icon: 'fa-regular fa-moon', color: 'var(--purple-accent)', insight: 'With the Moon in Scorpio in your 1st House, your emotions are deep, intense, and highly visible to others. You possess an magnetic, mysterious presence and strong intuition.' },
    { name: 'Mercury', sign: 'Virgo', house: '11th House', icon: 'fa-solid fa-wand-magic-sparkles', color: 'var(--blue-accent)', insight: 'Mercury in Virgo makes you a highly analytical and precise communicator. In the 11th House, you excel at organizing community efforts and clear-headed networking.' },
    { name: 'Mars', sign: 'Aries', house: '6th House', icon: 'fa-solid fa-fire-flame-curved', color: '#ff4d4d', insight: 'Mars in Aries in the 6th House gives you incredible energy for your daily work and wellness. You tackle tasks with speed and courage, though you may need to watch for burnout.' },
  ];

  return (
    <>
      <PlacementsContainer>
        <PlacementTitle>Planetary Placements</PlacementTitle>
        {placements.map((p, i) => (
          <PlacementRow key={i} onClick={() => setSelected(p)}>
            <RowContent>
              <PlanetIcon color={p.color}><i className={p.icon}></i></PlanetIcon>
              <PlacementText>
                <b>{p.name} in {p.sign}</b>
                <span>{p.house}</span>
              </PlacementText>
            </RowContent>
            <ChevronIcon className="fa-solid fa-chevron-right" />
          </PlacementRow>
        ))}
      </PlacementsContainer>

      {selected && (
        <InsightModal onClick={() => setSelected(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <PlanetIcon color={selected.color} large>
              <i className={selected.icon}></i>
            </PlanetIcon>
            <Badge>{selected.name} Insight</Badge>
            <ModalTitle>{selected.name} in {selected.sign}</ModalTitle>
            <ModalInsight>{selected.insight}</ModalInsight>
            <CosmicButton primary onClick={() => setSelected(null)}>Close Insight</CosmicButton>
          </ModalContent>
        </InsightModal>
      )}
    </>
  );
};

export default DetailedPlacements;
