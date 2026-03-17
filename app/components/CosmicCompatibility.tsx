"use client";

import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { GlassCard, CosmicButton, Badge } from './ui/CosmicUI';

const spinSlow = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const CompatibilitySection = styled.section`
  margin: 80px 0;
  text-align: center;
`;

const ProfileRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 40px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const ProfileItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const AvatarCircle = styled.div<{ color: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid ${props => props.color};
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 0 20px ${props => props.color}44;
`;

const WheelContainer = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OuterRing = styled.div`
  position: absolute;
  inset: 0;
  border: 1px dashed rgba(248, 207, 156, 0.3);
  border-radius: 50%;
  animation: ${spinSlow} 20s linear infinite;
`;

const ScoreCircle = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 4px solid var(--gold-accent);
  background: var(--bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 0 30px rgba(248, 207, 156, 0.4);
`;

const ScoreValue = styled.span`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--gold-accent);
`;

const ScoreLabel = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.6;
`;

const HeroHeading = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-top: 10px;
`;

const SectionSubtitle = styled.p`
  color: var(--text-dim);
`;

const HeartIcon = styled.div`
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.2);
`;

const UserName = styled.div`
  font-weight: bold;
`;

const UserSigns = styled.div`
  font-size: 0.8rem;
  color: var(--text-dim);
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
`;

const StatBar = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: left;
`;

const ProgressBar = styled.div<{ barWidth: string, color: string }>`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 10px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${props => props.barWidth};
    background: ${props => props.color};
    border-radius: 3px;
    box-shadow: 0 0 10px ${props => props.color};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StatTitle = styled.span`
  font-weight: bold;
`;

const StatValue = styled.span<{ color: string }>`
  color: ${props => props.color};
`;

const Quote = styled.p`
  font-style: italic;
  color: var(--text-dim);
  margin-bottom: 30px;
`;

const SubmitButton = styled(CosmicButton)`
  margin-top: 40px;
`;

const CosmicCompatibility = () => {
  return (
    <CompatibilitySection id="compatibility">
      <HeroHeading>
        <Badge>SYNASTRY ENGINE</Badge>
        <SectionTitle>Cosmic Compatibility</SectionTitle>
        <SectionSubtitle>Analyze the synastry between two celestial identities.</SectionSubtitle>
      </HeroHeading>

      <GlassCard>
        <ProfileRow>
          <ProfileItem>
            <AvatarCircle color="var(--gold-accent)">
              <i className="fa-solid fa-user-astronomer"></i>
            </AvatarCircle>
            <UserName>You</UserName>
            <UserSigns>♈ ♋ ♌</UserSigns>
          </ProfileItem>

          <HeartIcon>
            <i className="fa-solid fa-heart-pulse"></i>
          </HeartIcon>

          <ProfileItem>
            <AvatarCircle color="var(--purple-accent)">
              <i className="fa-solid fa-user-shuttle"></i>
            </AvatarCircle>
            <UserName>Partner</UserName>
            <UserSigns>♏ ♍ ♑</UserSigns>
          </ProfileItem>
        </ProfileRow>

        <WheelContainer>
          <OuterRing />
          <ScoreCircle>
            <ScoreValue>88%</ScoreValue>
            <ScoreLabel>Match</ScoreLabel>
          </ScoreCircle>
        </WheelContainer>

        <Quote>
          &quot;A harmonious alignment of fire and earth energies.&quot;
        </Quote>

        <AnalysisGrid>
          <StatBar>
            <StatHeader>
              <StatTitle><i className="fa-solid fa-comments"></i> Communication</StatTitle>
              <StatValue color="var(--gold-accent)">85%</StatValue>
            </StatHeader>
            <ProgressBar barWidth="85%" color="var(--gold-accent)" />
          </StatBar>

          <StatBar>
            <StatHeader>
              <StatTitle><i className="fa-solid fa-heart"></i> Emotional Resonance</StatTitle>
              <StatValue color="var(--purple-accent)">92%</StatValue>
            </StatHeader>
            <ProgressBar barWidth="92%" color="var(--purple-accent)" />
          </StatBar>

          <StatBar>
            <StatHeader>
              <StatTitle><i className="fa-solid fa-bolt"></i> Creative Spark</StatTitle>
              <StatValue color="var(--blue-accent)">70%</StatValue>
            </StatHeader>
            <ProgressBar barWidth="70%" color="var(--blue-accent)" />
          </StatBar>
        </AnalysisGrid>

        <SubmitButton primary>Compare New Transit</SubmitButton>
      </GlassCard>
    </CompatibilitySection>
  );
};

export default CosmicCompatibility;
