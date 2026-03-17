"use client";

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { GlassCard, CosmicButton, Badge } from './ui/CosmicUI';

const reveal = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const IntentionWrapper = styled(GlassCard)`
  padding: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const IntentionText = styled.p`
  font-size: 1.2rem;
  font-family: var(--font-heading);
  min-height: 3.6rem;
  line-height: 1.4;
  color: var(--text-primary);
  animation: ${reveal} 0.5s ease-out;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const GenerateButton = styled(CosmicButton)`
  flex: 1;
`;

const IntentionSubtext = styled.span`
  font-size: 0.7rem;
  color: var(--text-dim);
  opacity: 0.6;
`;

const intentions = [
  "I trust the timing of my life and the wisdom of the stars.",
  "Today, I communicate with clarity and kindness.",
  "I am grounded in my purpose and open to cosmic guidance.",
  "My intuition is sharp, and I act with confidence.",
  "I release what no longer serves my highest evolution.",
  "I attract abundance through gratitude and presence.",
  "Today, I nurture my emotional well-being and inner peace.",
  "I am a vehicle for creative expression and divine inspiration.",
];

const DailyIntention = () => {
  const [mounted, setMounted] = useState(false);
  const [intention, setIntention] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIntention(intentions[Math.floor(Math.random() * intentions.length)]);
  }, []);

  if (!mounted) return (
    <IntentionWrapper>
      <Badge>DAILY INTENTION</Badge>
      <div style={{ height: '3.6rem' }} />
      <ActionRow>
        <GenerateButton primary disabled>NEW INTENTION</GenerateButton>
      </ActionRow>
    </IntentionWrapper>
  );

  const generateNew = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const next = intentions[Math.floor(Math.random() * intentions.length)];
      setIntention(next);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <IntentionWrapper>
      <Badge>DAILY INTENTION</Badge>
      <IntentionText key={intention}>
        &quot;{intention}&quot;
      </IntentionText>
      <ActionRow>
        <GenerateButton 
          primary 
          onClick={generateNew}
          disabled={isGenerating}
        >
          {isGenerating ? 'Channeling...' : 'NEW INTENTION'}
        </GenerateButton>
      </ActionRow>
      <IntentionSubtext>
        Set your focus for the current transit.
      </IntentionSubtext>
    </IntentionWrapper>
  );
};

export default DailyIntention;
