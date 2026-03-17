"use client";

import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { GlassCard, Badge } from '../components/ui/CosmicUI';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';

const CommunityContainer = styled.main`
  padding: 100px 20px 120px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
`;

const HeaderContainer = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-top: 10px;
`;

const PageSubtitle = styled.p`
  color: var(--text-dim);
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 5px var(--gold-accent)); }
  50% { opacity: 0.7; filter: drop-shadow(0 0 15px var(--gold-accent)); }
`;

const VibeValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--gold-accent);
  margin-bottom: 5px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const GlobalStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled(GlassCard)`
  text-align: center;
  padding: 20px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--gold-accent);
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-dim);
`;

const FeedSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const FeedTitle = styled.h3`
  font-size: 1.2rem;
`;

const NewPostLink = styled.span`
  font-size: 0.8rem;
  color: var(--gold-accent);
  cursor: pointer;
`;

const WhisperCard = styled(GlassCard)`
  padding: 20px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
`;

const Avatar = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${props => props.color};
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 10px ${props => props.color}33;
`;

const AvatarIcon = styled.i<{ color: string }>`
  font-size: 0.8rem;
  color: ${props => props.color};
`;

const Content = styled.div`
  flex-grow: 1;
`;

const Author = styled.div`
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

const Message = styled.p`
  font-size: 0.85rem;
  color: var(--text-dim);
  line-height: 1.5;
`;

const WhisperMeta = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  
  & i {
    cursor: pointer;
    transition: color 0.2s;
    &:hover { color: var(--gold-accent); }
  }
`;

const whispers = [
  { id: 1, author: "AstroTraveler_88", msg: "The Full Moon in Leo is hitting different today. Feeling a massive creative surge! ♌✨", color: "var(--gold-accent)", likes: 42, comments: 5 },
  { id: 2, author: "CosmicNova", msg: "Just discovered my Pluto is in the 4th House. Deep ancestral healing mode: ON.", color: "var(--purple-accent)", likes: 28, comments: 2 },
  { id: 3, author: "LunarLink", msg: "Anyone else feeling the Mercury pre-shadow? Communication feels like swimming through stardust.", color: "var(--blue-accent)", likes: 15, comments: 8 },
  { id: 4, author: "SolsticeSeeker", msg: "Grateful for the Luna AI Guide's advice on my Saturn return rituals. It's making the transition so much clearer.", color: "var(--gold-accent)", likes: 56, comments: 12 },
];

export default function CommunityPage() {
  return (
    <>
      <Navbar />
      <CommunityContainer>
        <HeaderContainer>
          <Badge>CELESTIAL HUB</Badge>
          <PageTitle>Community Alignment</PageTitle>
          <PageSubtitle>Sync with the collective cosmic frequency.</PageSubtitle>
        </HeaderContainer>

        <GlobalStats>
          <StatCard>
            <StatValue>{whispers.length * 312 + 12000}+</StatValue>
            <StatLabel>Active Seekers</StatLabel>
          </StatCard>
          <StatCard>
            <VibeValue>Introspective</VibeValue>
            <StatLabel>Global Vibe</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>89%</StatValue>
            <StatLabel>Harmonic Sync</StatLabel>
          </StatCard>
        </GlobalStats>

        <FeedSection>
          <FeedHeader>
            <FeedTitle>Cosmic Whispers</FeedTitle>
            <NewPostLink>New Post <i className="fa-solid fa-plus"></i></NewPostLink>
          </FeedHeader>
          
          {whispers.map(w => (
            <WhisperCard key={w.id}>
              <Avatar color={w.color}>
                <AvatarIcon color={w.color} className="fa-solid fa-star-of-david" />
              </Avatar>
              <Content>
                <Author>{w.author}</Author>
                <Message>{w.msg}</Message>
                <WhisperMeta>
                  <span><i className="fa-solid fa-sparkles"></i> {w.likes}</span>
                  <span><i className="fa-solid fa-comment-dots"></i> {w.comments}</span>
                  <span><i className="fa-solid fa-share-nodes"></i> Share</span>
                </WhisperMeta>
              </Content>
            </WhisperCard>
          ))}
        </FeedSection>
      </CommunityContainer>
      <MobileNav />
    </>
  );
}
