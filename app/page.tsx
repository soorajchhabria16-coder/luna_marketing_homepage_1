"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import Navbar from './components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isSignedIn } = useUser();
  const [birthData, setBirthData] = useState({ name: '', date: '', location: '', time: '' });
  const [isCalculated, setIsCalculated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resultData, setResultData] = useState({ sun: 'Leo', moon: 'Scorpio', rising: 'Libra', profile: '', aiInsight: '' });
  const [displayTime, setDisplayTime] = useState('');
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [vibeData, setVibeData] = useState({ 
    title: "Today's Vibe", 
    summary: "Reading the celestial currents...", 
    full: "Calculating transits...", 
    focus: "Intuition", 
    caution: "Impulsiveness" 
  });

  // ===================== STAR CANVAS LOGIC =====================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let scrollY = 0;

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }
    resize();
    
    const handleResize = () => resize();
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) / 30;
      targetMouseY = (e.clientY - window.innerHeight / 2) / 30;
    };
    const handleScroll = () => { scrollY = window.pageYOffset; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    const STAR_COUNT = 350;
    interface Star { x: number; y: number; z: number; r: number; alpha: number; delta: number; color: string; }
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 2 + 0.5,
        r: Math.random() * 1.8 + 0.2,
        alpha: Math.random(),
        delta: (Math.random() * 0.008 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
        color: Math.random() < 0.2 ? '#f8cf9c' : (Math.random() < 0.1 ? '#a78bfa' : '#ffffff')
      });
    }

    const nebulas = [
      { x: 0.2, y: 0.3, r: 400, color: 'rgba(128, 56, 150, 0.15)' },
      { x: 0.8, y: 0.7, r: 500, color: 'rgba(46, 75, 169, 0.12)' },
      { x: 0.5, y: 0.5, r: 350, color: 'rgba(167, 139, 250, 0.08)' }
    ];

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      ctx.fillStyle = '#080914';
      ctx.fillRect(0, 0, w, h);
      nebulas.forEach(n => {
        const nx = n.x * w - (mouseX * 0.5);
        const ny = n.y * h - (mouseY * 0.5) - (scrollY * 0.2);
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });
      stars.forEach(s => {
        s.alpha += s.delta;
        if (s.alpha <= 0.1 || s.alpha >= 1) s.delta *= -1;
        const px = s.x - (mouseX * s.z);
        let py = s.y - (mouseY * s.z) - (scrollY * 0.1 * s.z);
        while (py < 0) py += h;
        while (py > h) py -= h;
        ctx.beginPath();
        ctx.arc(px % w, py, s.r * (s.z / 2), 0, Math.PI * 2);
        ctx.fillStyle = s.color.startsWith('#') 
          ? `rgba(${parseInt(s.color.slice(1,3), 16)},${parseInt(s.color.slice(3,5), 16)},${parseInt(s.color.slice(5,7), 16)},${s.alpha})`
          : `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // ===================== FETCH VIBE LOGIC =====================
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

  // ===================== SCROLL REVEAL LOGIC =====================
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) reveal.classList.add('active');
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  // ===================== BIRTH CHART LOGIC =====================
  const handleChartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const descriptions: Record<string, string> = {
      "Aries": "bold, energetic, and pioneering.",
      "Taurus": "grounded, reliable, and luxury-loving.",
      "Gemini": "curious, adaptable, and communicative.",
      "Cancer": "intuitive, nurturing, and protective.",
      "Leo": "radiant, confident, and charismatic.",
      "Virgo": "analytical, precise, and helpful.",
      "Libra": "diplomatic, aesthetic, and balanced.",
      "Scorpio": "intense, passionate, and mysterious.",
      "Sagittarius": "optimistic, adventurous, and wise.",
      "Capricorn": "ambitious, disciplined, and practical.",
      "Aquarius": "innovative, unique, and humanitarian.",
      "Pisces": "empathetic, artistic, and spiritual."
    };

    const getDeterministicSign = (str: string, salt: string) => {
      let hash = 0;
      const combined = str + salt;
      for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) - hash) + combined.charCodeAt(i);
        hash |= 0;
      }
      return signs[Math.abs(hash) % signs.length];
    };

    const sun = getDeterministicSign(birthData.date, "sun");
    const moon = getDeterministicSign(birthData.name + birthData.date, "moon");
    const rising = getDeterministicSign(birthData.time + birthData.location, "rising");
    const profile = `With a ${sun} Sun, your core essence is ${descriptions[sun]} Your ${moon} Moon brings a subconscious that is ${descriptions[moon]} Finally, your ${rising} Rising shapes a persona that is ${descriptions[rising]}`;

    setTimeout(async () => {
      // Call AI for personalized reading
      let aiInsight = '';
      try {
        const aiRes = await fetch('/api/readings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sun, moon, rising, name: birthData.name })
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          aiInsight = aiData.reading;
        }
      } catch (err) {
        console.error('AI Insight Error:', err);
      }

      setResultData({ sun, moon, rising, profile, aiInsight });
      if (birthData.time) {
        const [h, m] = birthData.time.split(':');
        let h_num = parseInt(h);
        const ampm = h_num >= 12 ? 'PM' : 'AM';
        h_num = h_num % 12 || 12;
        setDisplayTime(`${h_num}:${m} ${ampm}`);
      }
      setIsCalculated(true);
      setLoading(false);
      setTimeout(() => {
        const target = document.getElementById('chart-results');
        if (target) window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
      }, 100);
    }, 1800);
  };
  const handleSaveChart = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: birthData.name,
          birth_date: birthData.date,
          birth_time: birthData.time,
          location: birthData.location,
          sun_sign: resultData.sun,
          moon_sign: resultData.moon,
          rising_sign: resultData.rising,
        }),
      });
      if (res.ok) setSaved(true);
    } catch (err) {
      console.error('Failed to save chart', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Basic PDF Layout
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("LUNA - Your Cosmic Profile", 105, 20, { align: "center" });
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${birthData.name || 'User'}`, 20, 40);
      doc.text(`Location: ${birthData.location}`, 20, 50);
      doc.text(`Date: ${birthData.date}`, 20, 60);
      if (displayTime) doc.text(`Time: ${displayTime}`, 20, 70);
      
      doc.setLineWidth(0.5);
      doc.line(20, 80, 190, 80);
      
      doc.setFont("helvetica", "bold");
      doc.text("Celestial Alignments:", 20, 95);
      doc.setFont("helvetica", "normal");
      doc.text(`Sun: ${resultData.sun}`, 30, 105);
      doc.text(`Moon: ${resultData.moon}`, 30, 115);
      doc.text(`Rising: ${resultData.rising}`, 30, 125);
      
      doc.setFont("helvetica", "bold");
      doc.text("AI Insight (Gemini Powered):", 20, 145);
      doc.setFont("helvetica", "normal");
      const splitProfile = doc.splitTextToSize(resultData.aiInsight || resultData.profile, 170);
      doc.text(splitProfile, 20, 155);
      
      doc.setFontSize(10);
      doc.text("Generated by Luna AI Astrology", 105, 280, { align: "center" });
      
      doc.save(`${birthData.name || 'Luna'}_Birth_Chart.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('PDF generation failed. Please try again later.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Modal Components
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

  const YearModal = () => (
    <div className="modal-overlay" onClick={() => setShowYearModal(false)}>
      <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowYearModal(false)}>&times;</button>
        <h2>2026 Year Ahead</h2>
        <div className="modal-body">
          <p>2026 is a year of transition and growth. Saturn&apos;s movement into Aries marks a new cycle of discipline and initiative.</p>
          <p><strong>Key Themes:</strong> Career expansion, bold new beginnings, and structural changes in personal life.</p>
          <p><strong>Major Dates:</strong> Solar Eclipse in March 2026 will bring sudden clarity to long-standing dilemmas.</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <canvas ref={canvasRef} className="star-canvas"></canvas>
      <Navbar />
      
      {showVibeModal && <VibeModal />}
      {showYearModal && <YearModal />}

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>LUNA &ndash; Your AI-native<br />astrology guide</h1>
            <p>Personalized birth charts, daily horoscopes, and<br />educational content, powered by advanced AI</p>
            <a href="#birth-chart" className="btn-primary pulse">CREATE MY CHART</a>
          </div>
          <div className="hero-image-container">
            <div className="constellation-anim" aria-hidden="true">
              <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="constellation-svg">
                <g className="const-lines" stroke="rgba(168,130,255,0.4)" strokeWidth="1.2" fill="none">
                  <line x1="250" y1="80" x2="180" y2="130"/><line x1="250" y1="80" x2="320" y2="130"/>
                  <line x1="180" y1="130" x2="140" y2="210"/><line x1="320" y1="130" x2="360" y2="210"/>
                  <line x1="140" y1="210" x2="150" y2="300"/><line x1="360" y1="210" x2="350" y2="300"/>
                  <line x1="150" y1="300" x2="250" y2="380"/><line x1="350" y1="300" x2="250" y2="380"/>
                  <line x1="250" y1="80" x2="250" y2="180"/><line x1="180" y1="130" x2="250" y2="180"/>
                  <line x1="320" y1="130" x2="250" y2="180"/><line x1="140" y1="210" x2="250" y2="180"/>
                  <line x1="360" y1="210" x2="250" y2="180"/><line x1="250" y1="180" x2="250" y2="280"/>
                  <line x1="150" y1="300" x2="250" y2="280"/><line x1="350" y1="300" x2="250" y2="280"/>
                  <line x1="180" y1="130" x2="150" y2="300" opacity="0.3"/>
                  <line x1="320" y1="130" x2="350" y2="300" opacity="0.3"/>
                </g>
                <g className="const-stars" fill="#c4b5fd">
                  <circle cx="250" cy="80" r="5" className="star-node s-n-1"/><circle cx="180" cy="130" r="4" className="star-node s-n-2"/>
                  <circle cx="320" cy="130" r="4" className="star-node s-n-3"/><circle cx="140" cy="210" r="6" className="star-node s-n-4"/>
                  <circle cx="360" cy="210" r="6" className="star-node s-n-5"/><circle cx="250" cy="180" r="8" className="star-node s-n-6"/>
                  <circle cx="150" cy="300" r="4" className="star-node s-n-7"/><circle cx="350" cy="300" r="4" className="star-node s-n-8"/>
                  <circle cx="250" cy="280" r="7" className="star-node s-n-9"/><circle cx="250" cy="380" r="5" className="star-node s-n-10"/>
                </g>
                <circle cx="250" cy="180" r="60" fill="url(#coreGlow)" opacity="0.4" className="core-node"/>
                <defs>
                  <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="transparent"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </section>

        <section className="features-section" id="vibe">
          <div className="glass-card horizontal-card vibe-card reveal">
            <div className="card-image-wrap vibe-anim-wrap">
              <div className="vibe-anim" aria-hidden="true">
                <div className="vibe-orbit-ring ring-1"></div>
                <div className="vibe-orbit-ring ring-2"></div>
                <div className="vibe-orbit-ring ring-3"></div>
                <div className="vibe-moon">🌙</div>
                <div className="vibe-sparkle s1">✦</div><div className="vibe-sparkle s2">✧</div>
                <div className="vibe-sparkle s3">✦</div><div className="vibe-sparkle s4">✧</div>
              </div>
            </div>
            <div className="card-content">
              <h2>{vibeData.title}</h2>
              <p>{vibeData.summary}</p>
              <button className="btn-secondary" onClick={() => setShowVibeModal(true)}>READ FULL VIBE</button>
            </div>
          </div>

          <div className="glass-card horizontal-card year-card reverse reveal">
            <div className="card-content">
              <h2>2026 Year Ahead</h2>
              <p>Discover your key themes and cosmic alignments for 2026. Unlock the potential of the coming year.</p>
              <button className="btn-secondary" onClick={() => setShowYearModal(true)}>EXPLORE 2026 FORECAST</button>
            </div>
            <div className="card-image-wrap orbit-anim-wrap">
              <div className="orbit-anim" aria-hidden="true">
                <div className="orbit-center">☀</div>
                <div className="orbit-track track-1"><div className="orbit-planet p1">♈</div></div>
                <div className="orbit-track track-2"><div className="orbit-planet p2">♍</div></div>
                <div className="orbit-track track-3"><div className="orbit-planet p3">♓</div></div>
                <svg className="orbit-wheel" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="150" cy="150" r="60" stroke="rgba(248,207,156,0.3)" strokeWidth="1" fill="none" strokeDasharray="4 6"/>
                  <circle cx="150" cy="150" r="95" stroke="rgba(168,130,255,0.3)" strokeWidth="1" fill="none" strokeDasharray="4 6"/>
                  <circle cx="150" cy="150" r="130" stroke="rgba(99,179,237,0.3)" strokeWidth="1" fill="none" strokeDasharray="4 6"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ASTRO 101 SECTION */}
        <section className="astro-101-section reveal" id="astro-101">
          <div className="section-heading">
            <h2>The Three Pillars</h2>
            <p>Your astrological identity is more than just your sun sign. Discover the trinity that defines your cosmic essence.</p>
          </div>
          <div className="cards-grid">
            <div className="glass-card vertical-card">
              <div className="icon-wrap"><i className="fa-regular fa-sun"></i></div>
              <h3>The Sun: Your Essence</h3>
              <p>Understanding your core personality and ego. The source of your vitality.</p>
              <button className="btn-secondary" onClick={() => setShowVibeModal(true)}>LEARN MORE</button>
            </div>
            <div className="glass-card vertical-card">
              <div className="icon-wrap"><i className="fa-regular fa-moon"></i></div>
              <h3>The Moon: Your Emotions</h3>
              <p>Exploring your emotional inner world and subconscious needs.</p>
              <button className="btn-secondary" onClick={() => setShowVibeModal(true)}>LEARN MORE</button>
            </div>
            <div className="glass-card vertical-card">
              <div className="icon-wrap"><i className="fa-solid fa-masks-theater"></i></div>
              <h3>Rising Sign: Your Mask</h3>
              <p>How you present yourself to the world and your first impressions.</p>
              <button className="btn-secondary" onClick={() => setShowVibeModal(true)}>LEARN MORE</button>
            </div>
          </div>
        </section>

        <section className="birth-chart-section reveal" id="birth-chart">
          <div className="section-heading chart-section-heading">
            <h2>Birth Chart Generator</h2>
            <p>Enter your details to generate your cosmic profile.</p>
          </div>
          
          {!isCalculated ? (
            <div className="glass-card form-card chart-form-card">
              <form className="chart-form" onSubmit={handleChartSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" placeholder="Enter your name" required className="chart-input"
                    value={birthData.name} onChange={(e) => setBirthData({...birthData, name: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" required className="chart-input"
                      value={birthData.date} onChange={(e) => setBirthData({...birthData, date: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time of Birth</label>
                    <input type="time" required className="chart-input"
                      value={birthData.time} onChange={(e) => setBirthData({...birthData, time: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">City of Birth</label>
                  <input type="text" placeholder="e.g. New York, NY" required className="chart-input"
                    value={birthData.location} onChange={(e) => setBirthData({...birthData, location: e.target.value})} />
                </div>
                <button type="submit" className="btn-primary chart-submit-btn" disabled={loading}>
                  {loading ? <><i className="fa-solid fa-spinner fa-spin"></i> CALCULATING ALIGNMENTS...</> : '✨ GENERATE MY CHART'}
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-card results-card reveal active" id="chart-results">
              <div className="results-layout">
                <div className="results-image">
                  <Image 
                    src="/assets/birth_chart_ui.png" 
                    alt="Birth Chart" 
                    className="chart-ui-image"
                    width={500}
                    height={500}
                    priority
                  />
                </div>
                <div className="results-content">
                  <h2 className="results-name">{birthData.name || 'User'}&apos;s Chart</h2>
                  <p className="results-meta">
                    <i className="fa-solid fa-location-dot"></i> {birthData.location}
                    {displayTime && <> &nbsp;·&nbsp; <i className="fa-regular fa-clock"></i> {displayTime}</>}
                  </p>
                  
                  <div className="signs-row">
                    <div className="glass-card sign-card">
                      <i className="fa-solid fa-sun sign-icon sun-icon"></i>
                      <div className="sign-label">Sun</div>
                      <div className="sign-name">{resultData.sun}</div>
                    </div>
                    <div className="glass-card sign-card">
                      <i className="fa-solid fa-moon sign-icon"></i>
                      <div className="sign-label">Moon</div>
                      <div className="sign-name">{resultData.moon}</div>
                    </div>
                    <div className="glass-card sign-card">
                      <i className="fa-solid fa-circle-up sign-icon rising-icon"></i>
                      <div className="sign-label">Rising</div>
                      <div className="sign-name">{resultData.rising}</div>
                    </div>
                  </div>
                  
                  <h3>Cosmic Profile</h3>
                  <p className="results-profile">{resultData.profile}</p>
                  
                  <div className="ai-insight-box">
                    <h4>AI INSIGHT</h4>
                    <p>{resultData.aiInsight || 'Refining your celestial frequency...'}</p>
                  </div>
                  
                  <div className="results-actions">
                    <button className="btn-primary" onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                      {isGeneratingPDF ? <><i className="fa-solid fa-spinner fa-spin"></i> GENERATING...</> : 'DOWNLOAD PDF'}
                    </button>
                    
                    {isSignedIn ? (
                      <button className="btn-secondary save-btn" onClick={handleSaveChart} disabled={saving || saved}>
                        {saved 
                          ? <><i className="fa-solid fa-check"></i> Saved!</>
                          : saving 
                          ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
                          : <><i className="fa-solid fa-bookmark"></i> Save to Profile</>
                        }
                      </button>
                    ) : (
                      <SignInButton mode="modal">
                        <button className="btn-secondary save-btn">
                          <i className="fa-solid fa-bookmark"></i> Sign in to Save
                        </button>
                      </SignInButton>
                    )}

                    <button className="btn-nav-signin" onClick={() => { setIsCalculated(false); setSaved(false); }}>
                      RESET
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="app-features-section reveal" id="app">
          <div className="section-heading">
            <h2>The Universe in Your Pocket</h2>
            <p>Everything you need for your spiritual journey in one beautifully designed app.</p>
          </div>
          <div className="app-flex-container">
            <div className="app-image-container">
              <Image 
                src="/assets/app_mockup.png" 
                alt="Luna Mobile App" 
                className="app-mockup" 
                width={300}
                height={600}
              />
            </div>
            <div className="app-features-grid">
              <div className="feature-item">
                <div className="icon-circle"><i className="fa-solid fa-sparkles"></i></div>
                <h3>Daily Hyper-Personalized Horoscopes</h3>
                <p>Get insights tailored to your exact birth time, not just your sun sign.</p>
              </div>
              <div className="feature-item">
                <div className="icon-circle"><i className="fa-solid fa-heart"></i></div>
                <h3>Cosmic Compatibility</h3>
                <p>Check your astrological synergy with friends, partners, or crushes.</p>
              </div>
              <div className="feature-item">
                <div className="icon-circle"><i className="fa-brands fa-bots"></i></div>
                <h3>AI Astro-Guide Chat</h3>
                <p>Ask our advanced AI any astrology question and get profound, instantly accessible wisdom.</p>
              </div>
              <div className="feature-item">
                <div className="icon-circle"><i className="fa-solid fa-moon"></i></div>
                <h3>Moon Phase Tracking</h3>
                <p>Align your workflow and intentions with the current lunar cycle.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PODCASTS SECTION */}
        <section className="podcasts-section reveal" id="podcasts">
          <div className="section-heading">
            <h2>Cosmic Whispers Podcast</h2>
            <p>Listen to weekly insights, interviews, and deep dives into the mystical arts.</p>
          </div>
          <div className="podcast-grid">
            {[ 
              { ep: 42, title: "Navigating Pluto in Aquarius", desc: "What the next 20 years hold for collective transformation." },
              { ep: 41, title: "Venus Retrograde Survival Guide", desc: "Re-evaluating love, money, and personal values." },
              { ep: 40, title: "The Magic of Solar Returns", desc: "How to interpret the chart of your birthday year." }
            ].map((p, i) => (
              <div key={i} className="glass-card podcast-card">
                <div className={`podcast-cover placeholder-cover-${i+1}`}>
                    <i className="fa-solid fa-microphone-lines"></i>
                </div>
                <div className="podcast-info">
                    <span className="episode-tag">Episode {p.ep}</span>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <button className="btn-icon"><i className="fa-solid fa-play"></i> Listen</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section reveal">
          <div className="glass-card cta-card">
            <h2>Ready to align with the stars?</h2>
            <p>Join thousands of users discovering their true cosmic potential every day.</p>
            <div className="cta-buttons">
              <button className="btn-primary">DOWNLOAD THE APP</button>
              <Link href="/#birth-chart" className="btn-secondary">READ WEB VERSION</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer reveal" id="about">
        <div className="footer-links">
          <div className="footer-col">
            <h4>Company</h4>
            <Link href="/">Home</Link>
            <Link href="/#about">About Us</Link>
            <Link href="/#astro-101">Astro 101</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link href="/#app">App Features</Link>
            <Link href="/star-map">Celestial Map</Link>
            <Link href="/#podcasts">Podcasts</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link href="#">Terms</Link>
            <Link href="#">Privacy</Link>
          </div>
        </div>
        <div className="newsletter">
          <h4>SUBSCRIBE TO OUR NEWSLETTER</h4>
          <div className="input-group">
            <input type="email" placeholder="Your email address..." aria-label="Newsletter email" />
          </div>
          <div className="social-icons">
            <a href="#" title="X-Twitter"><i className="fa-brands fa-x-twitter"></i></a>
            <a href="#" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" title="TikTok"><i className="fa-brands fa-tiktok"></i></a>
          </div>
        </div>
      </footer>
    </>
  );
}
