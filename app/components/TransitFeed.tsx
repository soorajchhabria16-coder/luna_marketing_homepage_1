"use client";

import React from 'react';
import styled from '@emotion/styled';
import { GlassCard, Badge } from './ui/CosmicUI';

const TransitContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TransitItem = styled(GlassCard)`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const TransitDate = styled.div`
  text-align: center;
  min-width: 50px;
  
  & span:first-of-type {
    display: block;
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--gold-accent);
  }
  & span:last-of-type {
    font-size: 0.7rem;
    color: var(--text-dim);
    text-transform: uppercase;
  }
`;

const TransitDetails = styled.div`
  flex: 1;
  
  & h4 {
    margin: 0 0 5px 0;
    font-size: 0.9rem;
  }
  & p {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-dim);
  }
`;

const TransitFeed = () => {
  const transits = [
    { day: '16', month: 'MAR', title: 'Moon in Taurus ♉', desc: 'A grounding day for financial planning and sensual pleasures.' },
    { day: '18', month: 'MAR', title: 'Mercury Sextile Mars ♈', desc: 'Powerful surge in mental energy. Great for pitching new ideas.' },
    { day: '20', month: 'MAR', title: 'Sun Enters Aries (Equinox)', desc: 'The Astrological New Year. A moment of rebirth and new beginnings.' },
  ];

  return (
    <TransitContainer>
      {transits.map((t, i) => (
        <TransitItem key={i}>
          <TransitDate>
            <span>{t.day}</span>
            <span>{t.month}</span>
          </TransitDate>
          <TransitDetails>
            <h4>{t.title}</h4>
            <p>{t.desc}</p>
          </TransitDetails>
          <Badge>TRANSIT</Badge>
        </TransitItem>
      ))}
    </TransitContainer>
  );
};

export default TransitFeed;
