"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Link from 'next/link';
import type { BirthChart } from '@/lib/supabase';
import { GlassCard, CosmicButton, GradientText, Badge } from '../components/ui/CosmicUI';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import MoonPhaseCard from '../components/MoonPhaseCard';
import TransitFeed from '../components/TransitFeed';
import DailyIntention from '../components/DailyIntention';
import SynastryAnalysis from '../components/SynastryAnalysis';
import LunarRituals from '../components/LunarRituals';

const DashboardRoot = styled.div`
  min-height: 100vh;
  padding: 100px 20px 120px;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashHeader = styled.div`
  margin-bottom: 40px;
`;

const DashGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 5px var(--gold-accent)); }
  50% { opacity: 0.7; filter: drop-shadow(0 0 15px var(--gold-accent)); }
`;

const VibeValue = styled.h2`
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${pulse} 3s ease-in-out infinite;
  font-size: 2.5rem;
  margin: 10px 0;
`;

const SectionTitle = styled.h3<{ marginTop?: string }>`
  font-size: 1.2rem;
  margin-bottom: 20px;
  margin-top: ${props => props.marginTop || '0'};
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const VibeCard = styled(GlassCard)`
  padding: 40px;
  margin-bottom: 40px;
  text-align: center;
`;

const VibeSummary = styled.p`
  color: var(--text-dim);
  max-width: 600px;
  margin: 0 auto;
`;

const VibeButton = styled(CosmicButton)`
  margin-top: 30px;
`;

const EmptyState = styled(GlassCard)`
  padding: 40px;
  text-align: center;
  
  & p { color: var(--text-dim); }
`;

const EmptyButton = styled(CosmicButton)`
  margin-top: 20px;
`;

const LoadingState = styled.p`
  text-align: center;
  padding: 40px;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const SavedChartCard = styled(GlassCard)`
  padding: 20px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const ChartTitle = styled.div`
  & h4 { margin: 0; font-size: 1.1rem; }
  & span { font-size: 0.8rem; color: var(--text-dim); }
`;

const SignRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const SignBadge = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 5px;
  
  & i { font-size: 0.8rem; opacity: 0.6; }
  & b { font-size: 0.85rem; }
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
`;

const FullChartButton = styled(CosmicButton)`
  width: 100%;
`;

const MapCard = styled(GlassCard)`
  padding: 20px;
  cursor: pointer;
`;

const MapText = styled.p`
  font-size: 0.9rem;
  margin-bottom: 15px;
  color: var(--text-dim);
`;

const MapButton = styled(CosmicButton)`
  width: 100%;
`;

const RitualsContainer = styled.div`
  margin-top: 20px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const PDFButton = styled(CosmicButton)`
  flex: 1;
`;

export default function DashboardPage() {
  const { user } = useUser();
  const [charts, setCharts] = useState<BirthChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [vibeData, setVibeData] = useState({ 
    title: "Introspective", 
    summary: "The alignment of Neptune and the Moon suggests a day for deep inner reflection and trust in your intuition." 
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [chartsRes, vibeRes] = await Promise.all([
          fetch('/api/charts'),
          fetch('/api/vibe')
        ]);
        
        if (chartsRes.ok) setCharts(await chartsRes.json());
        if (vibeRes.ok) {
          const data = await vibeRes.json();
          setVibeData({ title: data.focus, summary: data.summary });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const deleteChart = async (id: string) => {
    try {
      await fetch(`/api/charts/${id}`, { method: 'DELETE' });
      setCharts(charts.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete chart', err);
    }
  };

  const handleDownloadPDF = async (chart: BirthChart) => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // 1. BACKGROUND
      doc.setFillColor(5, 6, 11);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // 2. HEADER
      doc.setFillColor(248, 207, 156);
      doc.rect(0, 0, pageWidth, 2, 'F');
      
      doc.setTextColor(248, 207, 156);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.text("LUNA", pageWidth / 2, 25, { align: "center" });
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("SAVED STELLAR REPORT", pageWidth / 2, 35, { align: "center" });

      // 3. USER DETAILS
      doc.setFillColor(26, 30, 50);
      doc.roundedRect(15, 45, pageWidth - 30, 40, 5, 5, 'F');
      
      doc.setTextColor(248, 207, 156);
      doc.setFontSize(10);
      doc.text("CONSULTANT:", 25, 55);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(chart.name, 25, 65);
      
      doc.setTextColor(248, 207, 156);
      doc.text("LOCATION:", 25, 75);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text(chart.location, 25, 80);

      doc.setTextColor(248, 207, 156);
      doc.text("DATE:", pageWidth - 70, 55);
      doc.setTextColor(255, 255, 255);
      doc.text(chart.birth_date, pageWidth - 70, 65);

      // 4. TRINITY
      const trinityY = 100;
      const boxWidth = (pageWidth - 50) / 3;
      
      doc.setTextColor(167, 139, 250);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("THE HOLY TRINITY", 20, 93);

      const signs = [
        { label: "SUN SIGN", val: chart.sun_sign, x: 20 },
        { label: "MOON SIGN", val: chart.moon_sign, x: 25 + boxWidth },
        { label: "RISING SIGN", val: chart.rising_sign, x: 30 + boxWidth * 2 }
      ];

      signs.forEach(s => {
        doc.setFillColor(30, 35, 60);
        doc.roundedRect(s.x, trinityY, boxWidth, 30, 3, 3, 'F');
        doc.setTextColor(248, 207, 156);
        doc.setFontSize(9);
        doc.text(s.label, s.x + boxWidth / 2, trinityY + 10, { align: "center" });
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.text(s.val, s.x + boxWidth / 2, trinityY + 22, { align: "center" });
      });

      // 5. FOOTER
      doc.setDrawColor(248, 207, 156);
      doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
      doc.setTextColor(248, 207, 156);
      doc.setFontSize(12);
      doc.text("LUNA AI", pageWidth / 2, pageHeight - 20, { align: "center" });

      doc.save(`${chart.name}_Stellar_Report.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    }
  };

  return (
    <>
      <Navbar />
      <DashboardRoot>
        <DashHeader>
          <Badge>COSMIC DASHBOARD</Badge>
          <h1>Welcome, <GradientText>{user?.firstName || 'Seeker'}</GradientText></h1>
        </DashHeader>

        <DashGrid>
          <div className="main-col">
            <VibeCard>
              <Badge>TODAY&apos;S VIBE</Badge>
              <VibeValue>{vibeData.title}</VibeValue>
              <VibeSummary>{vibeData.summary}</VibeSummary>
              <VibeButton 
                primary 
                onClick={() => window.dispatchEvent(new CustomEvent('openAstroChat'))}
              >
                ASK LUNA FOR GUIDANCE
              </VibeButton>
            </VibeCard>

            <SectionTitle><i className="fa-solid fa-scroll"></i> Saved Birth Charts</SectionTitle>
            {loading ? (
              <LoadingState><i className="fa-solid fa-spinner fa-spin"></i> Reading the stars...</LoadingState>
            ) : charts.length === 0 ? (
              <EmptyState>
                <p>No charts saved yet. Generate your first chart on the home page.</p>
                <Link href="/#birth-chart">
                   <EmptyButton primary>CREATE YOUR CHART</EmptyButton>
                </Link>
              </EmptyState>
            ) : (
              <ChartGrid>
                {charts.map(c => (
                  <SavedChartCard key={c.id}>
                    <ChartHeader>
                      <ChartTitle>
                        <h4>{c.name}</h4>
                        <span>{c.location}</span>
                      </ChartTitle>
                      <DeleteBtn onClick={() => c.id && deleteChart(c.id)} title="Remove chart">
                        <i className="fa-solid fa-trash"></i>
                      </DeleteBtn>
                    </ChartHeader>
                    <SignRow>
                      <SignBadge>
                        <i className="fa-solid fa-sun"></i>
                        <b>{c.sun_sign}</b>
                      </SignBadge>
                      <SignBadge>
                        <i className="fa-solid fa-moon"></i>
                        <b>{c.moon_sign}</b>
                      </SignBadge>
                      <SignBadge>
                        <i className="fa-solid fa-circle-up"></i>
                        <b>{c.rising_sign}</b>
                      </SignBadge>
                    </SignRow>
                    <ActionRow>
                      <PDFButton 
                        onClick={() => handleDownloadPDF(c)}
                        title="Download Stellar Report"
                      >
                        <i className="fa-solid fa-file-pdf"></i> REPORT
                      </PDFButton>
                      <Link href="/#birth-chart" style={{ flex: 1.5, display: 'block' }}>
                        <FullChartButton>FULL CHART</FullChartButton>
                      </Link>
                    </ActionRow>
                  </SavedChartCard>
                ))}
              </ChartGrid>
            )}

            <SynastryAnalysis charts={charts} />
          </div>

          <div className="side-col">
            <DailyIntention />
            
            <RitualsContainer>
              <LunarRituals />
            </RitualsContainer>

            <SectionTitle marginTop="40px"><i className="fa-solid fa-moon"></i> Lunar Cycle</SectionTitle>
            <MoonPhaseCard />
            
            <SectionTitle marginTop="40px"><i className="fa-solid fa-sparkles"></i> Upcoming Transits</SectionTitle>
            <TransitFeed />
            
            <SectionTitle marginTop="40px"><i className="fa-solid fa-map"></i> Celestial Map</SectionTitle>
            <Link href="/star-map">
              <MapCard>
                <MapText>Explore the live interactive star map for your location.</MapText>
                <MapButton>OPEN STAR MAP</MapButton>
              </MapCard>
            </Link>
          </div>
        </DashGrid>
      </DashboardRoot>
      <MobileNav />
    </>
  );
}
