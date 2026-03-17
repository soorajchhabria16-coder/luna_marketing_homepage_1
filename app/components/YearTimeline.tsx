"use client";

import React from 'react';
import styled from '@emotion/styled';
import { GlassCard, GradientText, Badge } from './ui/CosmicUI';

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 40px;
  position: relative;
  padding-left: 30px;

  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--gold-accent), var(--purple-accent), transparent);
    opacity: 0.3;
  }
`;

const TimelineItem = styled(GlassCard)`
  padding: 1.5rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -29px;
    top: 24px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--gold-accent);
    border: 3px solid var(--bg-color);
    box-shadow: 0 0 10px var(--gold-accent);
  }
`;

const DateText = styled.div`
  font-size: 0.8rem;
  color: var(--gold-accent);
  font-weight: bold;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const EventTitle = styled.h3`
  font-family: var(--font-heading);
  margin-bottom: 10px;
  font-size: 1.4rem;
`;

const transits = [
  { date: "March 24, 2026", title: "Solar Eclipse in Aries", desc: "A powerful new beginning. Expect sudden shifts in personal direction and bold initiatives." },
  { date: "June 15, 2026", title: "Saturn Sextile Jupiter", desc: "A period of grounded expansion. Hard work meets opportunity, leading to sustainable growth in career." },
  { date: "August 12, 2026", title: "Perseid Meteor Shower Peak", desc: "Heightened intuition and spiritual clarity. A time for manifesting deep-seated desires." }
];

const YearTimeline = () => {
  return (
    <section style={{ marginTop: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Badge>2026 VISION</Badge>
        <h2 style={{ fontSize: '2.5rem', marginTop: '10px' }}>Your Year Ahead</h2>
        <p style={{ color: 'var(--text-dim)' }}>Major celestial gateways and transits for the coming year.</p>
      </div>
      <TimelineContainer>
        {transits.map((t, i) => (
          <TimelineItem key={i}>
            <DateText>{t.date}</DateText>
            <EventTitle>{t.title}</EventTitle>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{t.desc}</p>
          </TimelineItem>
        ))}
      </TimelineContainer>
    </section>
  );
};

export default YearTimeline;
