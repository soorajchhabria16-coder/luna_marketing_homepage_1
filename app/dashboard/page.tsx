"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import type { BirthChart } from '@/lib/supabase';

export default function DashboardPage() {
  const { user } = useUser();
  const [charts, setCharts] = useState<BirthChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [vibeData, setVibeData] = useState({ 
    title: "Today's Vibe", 
    summary: "Reading the celestial currents...", 
    full: "Calculating transits...", 
    focus: "Intuition", 
    caution: "Impulsiveness" 
  });
  const [selectedCharts, setSelectedCharts] = useState<{ id1: string, id2: string }>({ id1: '', id2: '' });
  const [showCompModal, setShowCompModal] = useState(false);
  const [compReport, setCompReport] = useState({ score: 0, title: '', summary: '' });

  useEffect(() => {
    const canvas = document.getElementById('dashCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let mouseX = 0, mouseY = 0;
    
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    
    const handleResize = () => resize();
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 30;
      mouseY = (e.clientY - window.innerHeight / 2) / 30;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const stars: {x: number, y: number, z: number, r: number, alpha: number, delta: number}[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 2 + 0.5,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random(),
        delta: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1)
      });
    }

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#080914';
      ctx.fillRect(0, 0, w, h);
      
      stars.forEach(s => {
        s.alpha += s.delta;
        if (s.alpha <= 0.1 || s.alpha >= 1) s.delta *= -1;
        const px = s.x - (mouseX * s.z);
        const py = s.y - (mouseY * s.z);
        ctx.beginPath();
        ctx.arc((px + w) % w, (py + h) % h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    async function fetchVibe() {
      try {
        const res = await fetch('/api/vibe');
        if (res.ok) {
          const data = await res.json();
          setVibeData(data);
        }
      } catch (err) {
        console.error('Failed to fetch daily vibe', err);
      }
    }
    fetchVibe();
  }, []);

  useEffect(() => {
    async function fetchCharts() {
      try {
        const res = await fetch('/api/charts');
        if (res.ok) {
          const data = await res.json();
          setCharts(data);
        }
      } catch (err) {
        console.error('Failed to fetch charts', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCharts();
  }, []);

  const zodiacEmoji: Record<string, string> = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
    Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
  };

  const deleteChart = async (id: string) => {
    try {
      await fetch(`/api/charts/${id}`, { method: 'DELETE' });
      setCharts(charts.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete chart', err);
    }
  };

  const VibeModal = () => (
    <div className="modal-overlay" onClick={() => setShowVibeModal(false)}>
      <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowVibeModal(false)}>&times;</button>
        <h2>{vibeData.title}</h2>
        <div className="modal-body">
          <p>{vibeData.full}</p>
          <p><strong>Focus:</strong> {vibeData.focus}</p>
          <p><strong>Caution:</strong> {vibeData.caution}</p>
        </div>
      </div>
    </div>
  );
  const handleCompare = () => {
    if (!selectedCharts.id1 || !selectedCharts.id2) return;
    const c1 = charts.find(c => c.id === selectedCharts.id1);
    const c2 = charts.find(c => c.id === selectedCharts.id2);
    if (!c1 || !c2) return;

    // Simple compatibility logic based on signs
    const elements: Record<string, string> = {
      Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
      Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
      Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
      Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
    };

    const e1 = elements[c1.sun_sign];
    const e2 = elements[c2.sun_sign];

    let score = 75;
    let title = "Harmonious Connection";
    let summary = "The universe aligns your paths with a sense of natural understanding and ease.";

    if (e1 === e2) {
      score = 92;
      title = "Elemental Synergy";
      summary = `Both belonging to the ${e1} element, you share a fundamental frequency. Your communication is instinctive and your goals often mirror each other.`;
    } else if ((e1 === 'Fire' && e2 === 'Air') || (e1 === 'Air' && e2 === 'Fire')) {
      score = 88;
      title = "Dynamic Momentum";
      summary = "Fire and Air fuel each other's growth. This connection is marked by inspiration, excitement, and a shared intellectual spark.";
    } else if ((e1 === 'Earth' && e2 === 'Water') || (e1 === 'Water' && e2 === 'Earth')) {
      score = 85;
      title = "Nurturing Stability";
      summary = "Like rain on the soil, your connection is grounding and productive. You bring out the best in each other's practical and emotional lives.";
    } else if (c1.sun_sign === c2.sun_sign) {
      score = 95;
      title = "Twin Flame Resonance";
      summary = "Sharing the same sun sign creates a profound mirror effect. You see the best and most challenging parts of yourself in the other.";
    }

    setCompReport({ score, title, summary });
    setShowCompModal(true);
  };

  const CompatibilityModal = () => (
    <div className="modal-overlay" onClick={() => setShowCompModal(false)}>
      <div className="glass-card modal-content compatibility-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowCompModal(false)}>&times;</button>
        <div className="comp-header">
           <span className="comp-badge">CELESTIAL SYNERGY</span>
           <h2>{compReport.score}% Match</h2>
        </div>
        <div className="modal-body">
          <h3 className="comp-title">{compReport.title}</h3>
          <p>{compReport.summary}</p>
          <div className="comp-breakdown">
            <div className="comp-item">
              <span className="label">Communication</span>
              <div className="progress-bar"><div className="progress-fill" style={{ '--fill-width': `${compReport.score - 5}%` } as React.CSSProperties}></div></div>
            </div>
            <div className="comp-item">
              <span className="label">Emotional Depth</span>
              <div className="progress-bar"><div className="progress-fill" style={{ '--fill-width': `${compReport.score + 3}%` } as React.CSSProperties}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <canvas id="dashCanvas" className="star-canvas"></canvas>
      
      {showVibeModal && <VibeModal />}
      {showCompModal && <CompatibilityModal />}
      
      <header className="navbar">
        <Link href="/" className="logo">
          <i className="fa-solid fa-moon"></i> Luna
        </Link>
        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/#birth-chart">New Chart</Link>
        </nav>
        <div className="nav-actions">
          {/* UserButton dynamically imported in layout */}
        </div>
      </header>

      <main className="dashboard-main">

        <section className="dashboard-hero reveal active">
          <div className="dashboard-greeting">
            <h1>Welcome back, <span className="gradient-text">{user?.firstName || 'Cosmic Soul'}</span> ✨</h1>
            <p className="subtitle">Your celestial journey, all in one place.</p>
          </div>
          <Link href="/#birth-chart" className="btn-primary pulse">
            <i className="fa-solid fa-circle-plus"></i> Generate New Chart
          </Link>
        </section>

        <section className="dashboard-vibe reveal active">
          <div className="glass-card horizontal-card vibe-card">
             <div className="card-content">
                <div className="vibe-card-header">
                  <span className="vibe-icon">🌙</span>
                  <h2>{vibeData.title}</h2>
                </div>
                <p className="vibe-card-summary">{vibeData.summary}</p>
             </div>
             <div className="vibe-card-action">
                <button className="btn-secondary" onClick={() => setShowVibeModal(true)}>VIEW FULL INSIGHT</button>
             </div>
          </div>
        </section>

        {charts.length >= 2 && (
          <section className="dashboard-comp reveal active">
            <div className="glass-card comp-selection-card">
              <div className="comp-intro">
                <h2><i className="fa-solid fa-code-compare"></i> Cosmic Compatibility</h2>
                <p>Select two saved charts to analyze their celestial resonance.</p>
              </div>
              <div className="comp-selectors">
                <select 
                  className="chart-select" 
                  value={selectedCharts.id1}
                  title="Select First Soul"
                  onChange={(e) => setSelectedCharts({ ...selectedCharts, id1: e.target.value })}
                >
                  <option value="">Select First Soul</option>
                  {charts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.sun_sign})</option>)}
                </select>
                <i className="fa-solid fa-plus separator"></i>
                <select 
                  className="chart-select" 
                  value={selectedCharts.id2}
                  title="Select Second Soul"
                  onChange={(e) => setSelectedCharts({ ...selectedCharts, id2: e.target.value })}
                >
                  <option value="">Select Second Soul</option>
                  {charts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.sun_sign})</option>)}
                </select>
                <button 
                  className="btn-primary" 
                  onClick={handleCompare}
                  disabled={!selectedCharts.id1 || !selectedCharts.id2 || selectedCharts.id1 === selectedCharts.id2}
                >
                  ANALYZE SYNERGY
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="dashboard-charts reveal">
          <h2 className="section-title">
            <i className="fa-solid fa-scroll"></i> Your Saved Charts
          </h2>

          {loading ? (
            <div className="dashboard-loading">
              <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
              <p>Reading the stars...</p>
            </div>
          ) : charts.length === 0 ? (
            <div className="dashboard-empty glass-card">
              <i className="fa-solid fa-moon fa-3x empty-icon"></i>
              <h3>No charts saved yet</h3>
              <p>Generate your first birth chart and save it to your profile.</p>
              <Link href="/#birth-chart" className="btn-primary empty-btn">
                Create Your Chart
              </Link>
            </div>
          ) : (
            <div className="charts-grid">
              {charts.map((chart) => (
                <div key={chart.id} className="glass-card chart-card reveal active">
                  <div className="chart-card-header">
                    <span className="chart-zodiac-icon">{zodiacEmoji[chart.sun_sign] || '✨'}</span>
                    <div>
                      <h3>{chart.name}</h3>
                      <p className="chart-meta">
                        <i className="fa-solid fa-location-dot"></i> {chart.location}
                      </p>
                    </div>
                    <button
                      className="chart-delete-btn"
                      onClick={() => chart.id && deleteChart(chart.id)}
                      title="Delete chart"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>

                  <div className="chart-signs-row">
                    <div className="sign-badge">
                      <i className="fa-solid fa-sun icon-sun"></i>
                      <span className="sign-label">Sun</span>
                      <span className="sign-value">{chart.sun_sign}</span>
                    </div>
                    <div className="sign-badge">
                      <i className="fa-solid fa-moon icon-moon"></i>
                      <span className="sign-label">Moon</span>
                      <span className="sign-value">{chart.moon_sign}</span>
                    </div>
                    <div className="sign-badge">
                      <i className="fa-solid fa-circle-up icon-rising"></i>
                      <span className="sign-label">Rising</span>
                      <span className="sign-value">{chart.rising_sign}</span>
                    </div>
                  </div>

                  <div className="chart-card-footer">
                    <span className="chart-date">
                      <i className="fa-regular fa-calendar"></i> {chart.birth_date}
                    </span>
                    <span className="chart-saved-at">
                      Saved {chart.created_at ? new Date(chart.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
