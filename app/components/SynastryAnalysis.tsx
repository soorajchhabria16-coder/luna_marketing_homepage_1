"use client";

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { GlassCard, CosmicButton, Badge } from './ui/CosmicUI';
import type { BirthChart } from '@/lib/supabase';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled(GlassCard)`
  padding: 30px;
  margin-top: 40px;
`;

const SelectionRow = styled.div`
  display: flex;
  gap: 20px;
  margin: 30px 0;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const SelectWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-dim);
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  color: #fff;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  
  & option {
    background: #1a1e32;
    color: #fff;
  }
`;

const HeartDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.2);
`;

const ResultArea = styled.div`
  text-align: center;
  margin-top: 40px;
  animation: fadeIn 0.8s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid var(--gold-accent);
  margin: 0 auto 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 0 30px rgba(248, 207, 156, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    inset: -8px;
    border: 1px dashed rgba(248, 207, 156, 0.3);
    border-radius: 50%;
    animation: ${spin} 30s linear infinite;
  }
`;

const ScoreLabelUnder = styled.div`
  font-size: 0.7rem;
  text-transform: uppercase;
  opacity: 0.6;
`;

const ScoreValue = styled.span`
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--gold-accent);
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 30px;
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 15px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const StatVal = styled.div<{ color: string }>`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.color};
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.65rem;
  text-transform: uppercase;
  opacity: 0.6;
`;

const Summary = styled.p`
  color: var(--text-dim);
  font-style: italic;
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 500px;
  margin: 20px auto 0;
`;

const TimelineTitle = styled.h3`
  font-size: 1.1rem;
  margin: 40px 0 20px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
`;

const TimelineItem = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-left: 2px solid var(--gold-accent);
  padding: 15px 20px;
  border-radius: 0 15px 15px 0;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const EventDate = styled.span`
  font-size: 0.75rem;
  color: var(--gold-accent);
  font-weight: bold;
`;

const IntensityBadge = styled.span<{ level: string }>`
  font-size: 0.6rem;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: uppercase;
  background: ${props => 
    props.level === 'high' ? 'rgba(255, 77, 77, 0.1)' : 
    props.level === 'medium' ? 'rgba(167, 139, 250, 0.1)' : 
    'rgba(99, 179, 237, 0.1)'};
  color: ${props => 
    props.level === 'high' ? '#ff4d4d' : 
    props.level === 'medium' ? '#a78bfa' : 
    '#63b3ed'};
  border: 1px solid currentColor;
`;

const EventName = styled.h4`
  font-size: 1rem;
  margin: 0;
  color: var(--text-primary);
`;

const EventImpact = styled.p`
  font-size: 0.85rem;
  color: var(--text-dim);
  margin: 5px 0 0;
  line-height: 1.4;
`;

const SynastryTitle = styled.h2`
  font-size: 1.5rem;
  margin-top: 10px;
`;

const SynastrySubtitle = styled.p`
  color: var(--text-dim);
  font-size: 0.85rem;
`;

const AnalyzeButton = styled(CosmicButton)`
  width: 100%;
`;

const ActionRowInner = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 30px;
`;

const DownloadButton = styled(CosmicButton)`
  flex: 1;
`;

interface TimelineEvent {
  date: string;
  event: string;
  impact: string;
  intensity: 'low' | 'medium' | 'high';
}

interface Result {
  score: number;
  summary: string;
  stats: {
    communication: number;
    romance: number;
    synergy: number;
  };
  timeline?: TimelineEvent[];
}

const SynastryAnalysis = ({ charts }: { charts: BirthChart[] }) => {
  const [person1, setPerson1] = useState<string>('');
  const [person2, setPerson2] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const analyze = async () => {
    if (!person1 || !person2 || person1 === person2) {
      alert("Please select two different celestial identities.");
      return;
    }

    setLoading(true);
    try {
      const c1 = charts.find(c => c.id === person1);
      const c2 = charts.find(c => c.id === person2);

      const res = await fetch('/api/synastry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart1: c1, chart2: c2 })
      });

      if (res.ok) {
        setResult(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!result) return;
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      const c1 = charts.find(c => c.id === person1);
      const c2 = charts.find(c => c.id === person2);
      if (!c1 || !c2) return;

      // BACKGROUND
      doc.setFillColor(5, 6, 11);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // HEADER
      doc.setFillColor(248, 207, 156);
      doc.rect(0, 0, pageWidth, 2, 'F');
      
      doc.setTextColor(248, 207, 156);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.text("LUNA", pageWidth / 2, 25, { align: "center" });
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("DIVINE SYNASTRY REPORT", pageWidth / 2, 35, { align: "center" });

      // COMPARISON BOX
      doc.setFillColor(26, 30, 50);
      doc.roundedRect(15, 45, pageWidth - 30, 40, 5, 5, 'F');
      
      doc.setTextColor(248, 207, 156);
      doc.setFontSize(10);
      doc.text("ENTITIES IN HARMONY:", 25, 55);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(`${c1.name} + ${c2.name}`, 25, 68);
      
      doc.setTextColor(167, 139, 250);
      doc.setFontSize(10);
      doc.text(`${c1.sun_sign} | ${c1.moon_sign} | ${c1.rising_sign}`, 25, 78);
      doc.text(`${c2.sun_sign} | ${c2.moon_sign} | ${c2.rising_sign}`, pageWidth - 25, 78, { align: 'right' });

      // RESONANCE SCORE
      doc.setTextColor(248, 207, 156);
      doc.setFontSize(48);
      doc.setFont("helvetica", "bold");
      doc.text(`${result.score}%`, pageWidth / 2, 115, { align: "center" });
      doc.setFontSize(12);
      doc.text("TOTAL COSMIC RESONANCE", pageWidth / 2, 125, { align: "center" });

      // STATS
      const statY = 140;
      const boxW = (pageWidth - 50) / 3;
      
      const items = [
        { label: "INTELLECT", val: `${result.stats.communication}%`, x: 20 },
        { label: "PASSION", val: `${result.stats.romance}%`, x: 25 + boxW },
        { label: "SOUL WORK", val: `${result.stats.synergy}%`, x: 30 + boxW * 2 }
      ];

      items.forEach(i => {
        doc.setFillColor(30, 35, 60);
        doc.roundedRect(i.x, statY, boxW, 25, 3, 3, 'F');
        doc.setTextColor(248, 207, 156);
        doc.setFontSize(8);
        doc.text(i.label, i.x + boxW / 2, statY + 8, { align: "center" });
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text(i.val, i.x + boxW / 2, statY + 20, { align: "center" });
      });

      // ANALYSIS
      doc.setTextColor(167, 139, 250);
      doc.setFontSize(16);
      doc.text("THE DIVINE DYNAMIC", 20, 185);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const split = doc.splitTextToSize(result.summary, pageWidth - 40);
      doc.text(split, 20, 195, { lineHeightFactor: 1.5 });

      // FOOTER
      doc.setTextColor(248, 207, 156);
      doc.setFontSize(10);
      doc.text("LUNA AI ARCHIVE", pageWidth / 2, pageHeight - 15, { align: "center" });

      doc.save(`${c1.name}_${c2.name}_Synastry_Report.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Badge>SYNASTRY ENGINE</Badge>
      <SynastryTitle>Stellar Compatibility</SynastryTitle>
      <SynastrySubtitle>Compare the divine resonance between two souls.</SynastrySubtitle>

      <SelectionRow>
        <SelectWrap>
          <Label htmlFor="person1-select">First Essence</Label>
          <Select 
            id="person1-select"
            title="Select first person"
            aria-label="Select first celestial identity"
            value={person1} 
            onChange={e => setPerson1(e.target.value)}
          >
            <option value="">Select identity...</option>
            {charts.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </SelectWrap>

        <HeartDivider aria-hidden="true">
          <i className="fa-solid fa-heart-pulse"></i>
        </HeartDivider>

        <SelectWrap>
          <Label htmlFor="person2-select">Second Essence</Label>
          <Select 
            id="person2-select"
            title="Select second person"
            aria-label="Select second celestial identity"
            value={person2} 
            onChange={e => setPerson2(e.target.value)}
          >
            <option value="">Select identity...</option>
            {charts.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </SelectWrap>
      </SelectionRow>

      <AnalyzeButton 
        primary 
        onClick={analyze} 
        disabled={loading || !person1 || !person2}
      >
        {loading ? <><i className="fa-solid fa-spinner fa-spin"></i> INTERWEAVING FREQUENCIES...</> : 'ANALYZE DIVINE RESONANCE'}
      </AnalyzeButton>

      {result && (
        <ResultArea>
          <ScoreCircle>
            <ScoreValue>{result.score}%</ScoreValue>
            <ScoreLabelUnder>Resonance</ScoreLabelUnder>
          </ScoreCircle>

          <Summary>&quot;{result.summary}&quot;</Summary>

          <StatGrid>
            <StatItem>
              <StatVal color="var(--gold-accent)">{result.stats.communication}%</StatVal>
              <StatLabel>Intellect</StatLabel>
            </StatItem>
            <StatItem>
              <StatVal color="var(--purple-accent)">{result.stats.romance}%</StatVal>
              <StatLabel>Passion</StatLabel>
            </StatItem>
            <StatItem>
              <StatVal color="var(--blue-accent)">{result.stats.synergy}%</StatVal>
              <StatLabel>Soul Work</StatLabel>
            </StatItem>
          </StatGrid>

          {result.timeline && (
            <>
              <TimelineTitle><i className="fa-solid fa-timeline"></i> Relationship Timeline</TimelineTitle>
              <TimelineContainer>
                {result.timeline.map((event, idx) => (
                  <TimelineItem key={idx}>
                    <EventHeader>
                      <EventDate>{event.date}</EventDate>
                      <IntensityBadge level={event.intensity}>{event.intensity} Intensity</IntensityBadge>
                    </EventHeader>
                    <EventName>{event.event}</EventName>
                    <EventImpact>{event.impact}</EventImpact>
                  </TimelineItem>
                ))}
              </TimelineContainer>
            </>
          )}

          <ActionRowInner>
            <DownloadButton onClick={downloadReport}>
              <i className="fa-solid fa-file-pdf"></i> DOWNLOAD REPORT
            </DownloadButton>
            <CosmicButton style={{ flex: 1 }} onClick={() => setResult(null)}>
              NEW ANALYSIS
            </CosmicButton>
          </ActionRowInner>
        </ResultArea>
      )}
    </Container>
  );
};

export default SynastryAnalysis;
