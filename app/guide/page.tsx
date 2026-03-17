"use client";

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { GlassCard, Badge, CosmicButton } from '../components/ui/CosmicUI';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';

// ─── Animations ─────────────────────────────────────────────────────────────
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(248, 207, 156, 0.2); }
  50% { box-shadow: 0 0 25px rgba(248, 207, 156, 0.5); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─── Layout ──────────────────────────────────────────────────────────────────
const GuideContainer = styled.main`
  padding: 100px 20px 120px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const GuideTitle = styled.h1`
  font-size: 3rem;
  margin-top: 10px;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeroSubtitle = styled.p`
  color: var(--text-dim);
  max-width: 600px;
  margin: 10px auto 0;
`;

// ─── Tab Navigation ──────────────────────────────────────────────────────────
const TabRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0;
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--gold-accent)' : 'transparent'};
  padding: 12px 20px;
  color: ${props => props.active ? 'var(--gold-accent)' : 'var(--text-dim)'};
  font-family: inherit;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: -1px;
  
  &:hover { color: var(--gold-accent); }
`;

const TabContent = styled.div`
  animation: ${fadeUp} 0.5s ease-out;
`;

// ─── Shared Layout ─────────────────────────────────────────────────────────
const SectionHeader = styled.div`
  margin: 50px 0 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  
  & h2 {
    font-size: 1.3rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    white-space: nowrap;
  }
  
  & hr {
    flex-grow: 1;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

// ─── Astro 101 Styles ────────────────────────────────────────────────────────
const PillarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const PillarCard = styled(GlassCard)`
  padding: 30px;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover { transform: translateY(-5px); }
`;

const PillarDescription = styled.p`
  margin-top: 15px;
  font-size: 0.9rem;
  color: var(--text-dim);
`;

const IconWrap = styled.div`
  font-size: 2.5rem;
  color: var(--gold-accent);
  margin-bottom: 20px;
`;

const HousesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
`;

const HouseItem = styled(GlassCard)`
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  
  & span:first-of-type {
    font-weight: bold;
    color: var(--gold-accent);
  }
  & span:last-of-type {
    font-size: 0.8rem;
    color: var(--text-dim);
  }
`;

const HousesSubtitle = styled.p`
  color: var(--text-dim);
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

const GlossarySection = styled(GlassCard)`
  padding: 30px;
  margin-top: 10px;
`;

const TermRow = styled.div`
  margin-bottom: 20px;
  &:last-child { margin-bottom: 0; }
  
  & b { color: var(--gold-accent); display: block; margin-bottom: 5px; }
  & p { font-size: 0.9rem; color: var(--text-dim); margin: 0; }
`;

// ─── Lunar Rituals Styles ────────────────────────────────────────────────────
const PhaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const PhaseCard = styled(GlassCard)<{ borderColor: string }>`
  padding: 25px;
  border-top: 2px solid ${props => props.borderColor};
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    animation: ${glow} 2s infinite;
  }
`;

const PhaseName = styled.div<{ color: string }>`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${props => props.color};
  margin-bottom: 10px;
`;

const PhaseTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 10px;
`;

const PhaseDesc = styled.p`
  font-size: 0.85rem;
  color: var(--text-dim);
  line-height: 1.6;
`;

const RitualStepList = styled.ol`
  list-style: none;
  counter-reset: steps;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RitualStep = styled.li`
  counter-increment: steps;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px 20px 20px 65px;
  position: relative;
  
  &::before {
    content: counter(steps);
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    background: var(--gold-accent);
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.85rem;
  }
`;

const StepTitle = styled.h4`
  margin: 0 0 5px;
  font-size: 1rem;
`;

const StepDesc = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-dim);
`;

const CrystalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 15px;
`;

const CrystalCard = styled(GlassCard)`
  padding: 20px;
  text-align: center;
  transition: transform 0.3s;
  
  &:hover { transform: translateY(-5px); }
`;

const CrystalEmoji = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const CrystalName = styled.h4`
  margin: 0 0 5px;
  font-size: 0.95rem;
  color: var(--gold-accent);
`;

const CrystalUse = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-dim);
`;

const IntentionCard = styled(GlassCard)`
  padding: 35px;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  margin: 15px 0 5px;
`;

const CardSubtitle = styled.p`
  color: var(--text-dim);
  font-size: 0.85rem;
  margin-bottom: 25px;
`;

const GeneratorForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

const FormLabel = styled.label`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-dim);
`;

const FormSelect = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px 14px;
  color: #fff;
  font-family: inherit;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  width: 100%;
  
  & option { background: #1a1e32; color: #fff; }
`;

const shimmer = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
`;

const GeneratedAffirmation = styled.div`
  background: rgba(248, 207, 156, 0.05);
  border: 1px solid rgba(248, 207, 156, 0.2);
  border-radius: 20px;
  padding: 30px;
  margin: 25px 0;
  text-align: center;
  animation: ${fadeUp} 0.7s ease-out;
`;

const AffirmationReveal = styled.blockquote`
  font-style: italic;
  font-size: 1.15rem;
  line-height: 1.8;
  color: #fff;
  margin: 0 0 20px;
`;

const LoadingPulse = styled.div`
  font-size: 1.1rem;
  color: var(--gold-accent);
  animation: ${shimmer} 1.5s ease-in-out infinite;
  padding: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

const CopyBtn = styled(CosmicButton)`
  font-size: 0.8rem;
  padding: 8px 18px;
`;

const GenerateBtn = styled(CosmicButton)`
  width: 100%;
  padding: 14px;
`;

// ─── Data ────────────────────────────────────────────────────────────────────
const phases = [
  { name: "New Moon", title: "The Dark Gate", color: "#a78bfa", desc: "A sacred void — set intentions and plant the seeds of your manifestation cycle. The universe listens deeply in the dark.", borderColor: "#a78bfa" },
  { name: "Waxing Moon", title: "The Gathering", color: "#63b3ed", desc: "Energy builds. Take inspired action on your intentions. Call in resources, relationships, and momentum.", borderColor: "#63b3ed" },
  { name: "Full Moon", title: "The Apex", color: "#f8cf9c", desc: "Peak illumination. Release what no longer serves. Charge your tools, crystals, and intentions under moonlight.", borderColor: "#f8cf9c" },
  { name: "Waning Moon", title: "The Return", color: "#68d391", desc: "Graceful surrender. Shed old patterns. Detox, forgive, and prepare the field for the next cycle.", borderColor: "#68d391" },
];

const newMoonRitual = [
  { title: "Cleanse Your Space", desc: "Burn palo santo or sage to clear stagnant energy. Open a window to let darkness breathe." },
  { title: "Write Your Intentions", desc: "On a fresh piece of paper, script 3–5 desires in the present tense, as if already manifested." },
  { title: "Create Your Altar", desc: "Place your paper under a piece of clear quartz or black tourmaline to amplify and protect your intention." },
  { title: "Silent Meditation", desc: "Sit in stillness for 10 minutes. Breathe into the void. Visualize your intentions taking root." },
  { title: "Seal with Gratitude", desc: "Close by writing 3 things you are genuinely grateful for. Gratitude is the soil of manifestation." },
];

const fullMoonRitual = [
  { title: "Build a Release List", desc: "Write everything you wish to let go of — limiting beliefs, relationships, fears — onto a piece of paper." },
  { title: "Charge Your Crystals", desc: "Place your crystals on a windowsill or outside under the full moonlight. Let them absorb the peak lunar energy." },
  { title: "Ceremonial Burning", desc: "Safely burn your release list, watching the smoke carry your burdens away from your energy field." },
  { title: "Moon Water Ritual", desc: "Place a jar of water under the moonlight overnight. Use this charged water for drinking, bathing, or anointing." },
  { title: "Dance & Express", desc: "Move your body freestyle. The full moon governs emotion — let what's been held tightly flow free." },
];

const crystals = [
  { emoji: "🌑", name: "Black Tourmaline", use: "New Moon — Grounds & Protects" },
  { emoji: "🔮", name: "Clear Quartz", use: "New Moon — Amplifies Intent" },
  { emoji: "🌙", name: "Labradorite", use: "Waxing — Awakens Intuition" },
  { emoji: "💜", name: "Amethyst", use: "Full Moon — Spiritual Clarity" },
  { emoji: "🌕", name: "Selenite", use: "Full Moon — Charges & Cleanses" },
  { emoji: "💚", name: "Green Aventurine", use: "Waning — Releases & Renews" },
];

const ZODIAC_SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const PHASES = ['New Moon', 'Waxing Moon', 'Full Moon', 'Waning Moon'];

// ─── Component ───────────────────────────────────────────────────────────────
export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'astro101' | 'rituals'>('astro101');
  const [sunSign, setSunSign] = useState('');
  const [moonSign, setMoonSign] = useState('');
  const [lunarPhase, setLunarPhase] = useState('Full Moon');
  const [affirmation, setAffirmation] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateAffirmation = async () => {
    if (!sunSign || !moonSign) {
      alert('Please select your Sun and Moon signs first.');
      return;
    }
    setGenerating(true);
    setAffirmation('');
    try {
      const res = await fetch('/api/affirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sunSign, moonSign, currentPhase: lunarPhase })
      });
      if (res.ok) {
        const data = await res.json();
        setAffirmation(data.affirmation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(affirmation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <GuideContainer>
        <HeroSection>
          <Badge>COSMIC WISDOM</Badge>
          <GuideTitle>The Luna Codex</GuideTitle>
          <HeroSubtitle>Your comprehensive guide to decoding the language of the cosmos — from birth charts to lunar ceremony.</HeroSubtitle>
        </HeroSection>

        <TabRow>
          <Tab active={activeTab === 'astro101'} onClick={() => setActiveTab('astro101')}>
            <i className="fa-solid fa-star"></i> Astro 101
          </Tab>
          <Tab active={activeTab === 'rituals'} onClick={() => setActiveTab('rituals')}>
            <i className="fa-solid fa-moon"></i> Lunar Rituals
          </Tab>
        </TabRow>

        {activeTab === 'astro101' && (
          <TabContent>
            <SectionHeader>
              <h2>The Holy Trinity</h2>
              <hr />
            </SectionHeader>

            <PillarGrid>
              <PillarCard>
                <IconWrap><i className="fa-regular fa-sun"></i></IconWrap>
                <h3>The Sun</h3>
                <Badge>Core Identity</Badge>
                <PillarDescription>
                  Represents your ego, vitality, and the central focus of your life. It is the &quot;I Am&quot; of your cosmic profile.
                </PillarDescription>
              </PillarCard>

              <PillarCard>
                <IconWrap><i className="fa-regular fa-moon"></i></IconWrap>
                <h3>The Moon</h3>
                <Badge>Emotional Soul</Badge>
                <PillarDescription>
                  Governs your emotions, subconscious patterns, and what you need to feel safe and nurtured. The &quot;I Feel&quot; within.
                </PillarDescription>
              </PillarCard>

              <PillarCard>
                <IconWrap><i className="fa-solid fa-masks-theater"></i></IconWrap>
                <h3>The Rising</h3>
                <Badge>Outer Mask</Badge>
                <PillarDescription>
                  The sign that was rising on the eastern horizon at your birth. It dictates your first impressions and outward persona.
                </PillarDescription>
              </PillarCard>
            </PillarGrid>

            <SectionHeader>
              <h2>The 12 Houses</h2>
              <hr />
            </SectionHeader>
            <HousesSubtitle>Each house represents a specific area of your life where planetary energies play out.</HousesSubtitle>

            <HousesGrid>
              <HouseItem><span>1st House</span><span>Self &amp; Appearance</span></HouseItem>
              <HouseItem><span>2nd House</span><span>Values &amp; Money</span></HouseItem>
              <HouseItem><span>3rd House</span><span>Communication</span></HouseItem>
              <HouseItem><span>4th House</span><span>Home &amp; Family</span></HouseItem>
              <HouseItem><span>5th House</span><span>Creativity &amp; Joy</span></HouseItem>
              <HouseItem><span>6th House</span><span>Wellness &amp; Routine</span></HouseItem>
              <HouseItem><span>7th House</span><span>Relationships</span></HouseItem>
              <HouseItem><span>8th House</span><span>Transformation</span></HouseItem>
              <HouseItem><span>9th House</span><span>Higher Wisdom</span></HouseItem>
              <HouseItem><span>10th House</span><span>Career &amp; Legacy</span></HouseItem>
              <HouseItem><span>11th House</span><span>Community</span></HouseItem>
              <HouseItem><span>12th House</span><span>Subconscious</span></HouseItem>
            </HousesGrid>

            <SectionHeader>
              <h2>Cosmic Dictionary</h2>
              <hr />
            </SectionHeader>

            <GlossarySection>
              <TermRow>
                <b>Retrograde</b>
                <p>When a planet appears to move backward in the sky from our perspective on Earth, signaling a time for reflection and re-evaluation.</p>
              </TermRow>
              <TermRow>
                <b>Aspect</b>
                <p>The geometric angles formed between planets in the sky, indicating how those energies interact (e.g., in harmony or tension).</p>
              </TermRow>
              <TermRow>
                <b>Saturn Return</b>
                <p>The moment when Saturn returns to the exact position it was in when you were born (around age 29), often signaling a major life transition.</p>
              </TermRow>
              <TermRow>
                <b>Transit</b>
                <p>The movement of a planet in the sky relative to the positions in your natal chart. Transits trigger life events and inner shifts.</p>
              </TermRow>
              <TermRow>
                <b>Synastry</b>
                <p>The astrological comparison of two people&apos;s birth charts to understand the nature of their connection — cosmic compatibility.</p>
              </TermRow>
            </GlossarySection>
          </TabContent>
        )}

        {activeTab === 'rituals' && (
          <TabContent>
            <SectionHeader>
              <h2>The Four Sacred Phases</h2>
              <hr />
            </SectionHeader>

            <PhaseGrid>
              {phases.map((p, i) => (
                <PhaseCard key={i} borderColor={p.borderColor}>
                  <PhaseName color={p.color}>{p.name}</PhaseName>
                  <PhaseTitle>{p.title}</PhaseTitle>
                  <PhaseDesc>{p.desc}</PhaseDesc>
                </PhaseCard>
              ))}
            </PhaseGrid>

            <SectionHeader>
              <h2>New Moon Ceremony</h2>
              <hr />
            </SectionHeader>

            <RitualStepList>
              {newMoonRitual.map((step, i) => (
                <RitualStep key={i}>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDesc>{step.desc}</StepDesc>
                </RitualStep>
              ))}
            </RitualStepList>

            <SectionHeader>
              <h2>Full Moon Ceremony</h2>
              <hr />
            </SectionHeader>

            <RitualStepList>
              {fullMoonRitual.map((step, i) => (
                <RitualStep key={i}>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDesc>{step.desc}</StepDesc>
                </RitualStep>
              ))}
            </RitualStepList>

            <SectionHeader>
              <h2>Crystal Correspondences</h2>
              <hr />
            </SectionHeader>

            <CrystalGrid>
              {crystals.map((c, i) => (
                <CrystalCard key={i}>
                  <CrystalEmoji>{c.emoji}</CrystalEmoji>
                  <CrystalName>{c.name}</CrystalName>
                  <CrystalUse>{c.use}</CrystalUse>
                </CrystalCard>
              ))}
            </CrystalGrid>

            <SectionHeader>
              <h2>The Lunar Affirmation</h2>
              <hr />
            </SectionHeader>

            <IntentionCard>
              <Badge>AI LUNAR ORACLE</Badge>
              <CardTitle>Generate My Affirmation</CardTitle>
              <CardSubtitle>Enter your cosmic signature and receive a personal lunar invocation.</CardSubtitle>

              <GeneratorForm>
                <FormGroup>
                  <FormLabel htmlFor="aff-sun">Sun Sign</FormLabel>
                  <FormSelect id="aff-sun" title="Select your Sun Sign" aria-label="Select your Sun Sign" value={sunSign} onChange={e => setSunSign(e.target.value)}>
                    <option value="">Select...</option>
                    {ZODIAC_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="aff-moon">Moon Sign</FormLabel>
                  <FormSelect id="aff-moon" title="Select your Moon Sign" aria-label="Select your Moon Sign" value={moonSign} onChange={e => setMoonSign(e.target.value)}>
                    <option value="">Select...</option>
                    {ZODIAC_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel htmlFor="aff-phase">Current Phase</FormLabel>
                  <FormSelect id="aff-phase" title="Select current lunar phase" aria-label="Select current lunar phase" value={lunarPhase} onChange={e => setLunarPhase(e.target.value)}>
                    {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                  </FormSelect>
                </FormGroup>
              </GeneratorForm>

              <GenerateBtn
                primary
                onClick={generateAffirmation}
                disabled={generating || !sunSign || !moonSign}
              >
                {generating
                  ? <><i className="fa-solid fa-spinner fa-spin"></i> CHANNELING THE COSMOS...</>
                  : <><i className="fa-solid fa-sparkles"></i> GENERATE MY LUNAR AFFIRMATION</>}
              </GenerateBtn>

              {generating && (
                <LoadingPulse>
                  <i className="fa-solid fa-moon"></i> The oracle is weaving your invocation...
                </LoadingPulse>
              )}

              {affirmation && !generating && (
                <GeneratedAffirmation>
                  <AffirmationReveal>
                    &ldquo;{affirmation}&rdquo;
                  </AffirmationReveal>
                  <ActionButtons>
                    <CopyBtn onClick={copyToClipboard}>
                      <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                      {copied ? ' COPIED' : ' COPY'}
                    </CopyBtn>
                    <CopyBtn onClick={generateAffirmation}>
                      <i className="fa-solid fa-rotate"></i> REGENERATE
                    </CopyBtn>
                  </ActionButtons>
                </GeneratedAffirmation>
              )}
            </IntentionCard>
          </TabContent>
        )}
      </GuideContainer>
      <MobileNav />
    </>
  );
}
