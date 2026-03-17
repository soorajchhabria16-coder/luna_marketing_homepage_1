"use client";

import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { GlassCard, Badge, CosmicButton } from './ui/CosmicUI';

const RitualWrapper = styled(GlassCard)`
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RitualList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RitualItem = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 15px;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--gold-accent);
  }
`;

const RitualHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const RitualTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: var(--gold-accent);
`;

const RitualPhase = styled.span`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.6;
`;

const RitualDesc = styled.p`
  font-size: 0.8rem;
  color: var(--text-dim);
  margin: 0;
  line-height: 1.5;
`;

const FullGuideButton = styled(CosmicButton)`
  width: 100%;
  margin-top: 5px;
`;

const rituals = [
  {
    title: "Seed Setting",
    phase: "New Moon",
    desc: "Write your intentions for the lunar cycle on parchment and keep them under a clear quartz crystal."
  },
  {
    title: "Expansion Flow",
    phase: "Waxing Moon",
    desc: "Take action on your goals. Light a gold candle to attract abundance and mental clarity."
  },
  {
    title: "Full Illumination",
    phase: "Full Moon",
    desc: "A time for release. Charge your crystals under the moonlight and practice deep gratitude meditation."
  },
  {
    title: "Shedding Skin",
    phase: "Waning Moon",
    desc: "Declutter your space and mind. Use sage or palo santo to clear stagnant energy as the moon fades."
  }
];

const LunarRituals = () => {
  return (
    <RitualWrapper>
      <Badge>LUNAR RITUALS</Badge>
      <RitualList>
        {rituals.map((ritual, idx) => (
          <RitualItem key={idx}>
            <RitualHeader>
              <RitualTitle>{ritual.title}</RitualTitle>
              <RitualPhase>{ritual.phase}</RitualPhase>
            </RitualHeader>
            <RitualDesc>{ritual.desc}</RitualDesc>
          </RitualItem>
        ))}
      </RitualList>
      <Link href="/guide?tab=rituals">
        <FullGuideButton>
          <i className="fa-solid fa-moon"></i> FULL GUIDE
        </FullGuideButton>
      </Link>
    </RitualWrapper>
  );
};

export default LunarRituals;
