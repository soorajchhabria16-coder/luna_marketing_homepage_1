import { NextResponse } from 'next/server';

export async function GET() {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  
  // Deterministic "Vibe" based on date string
  const seed = dateString.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  
  const vibes = [
    {
      title: "The Intuitive Flow",
      summary: "A powerful day for emotional clarity and trusting your inner voice. The moon's alignment suggests heightened sensitivity.",
      full: "Today, Neptune's gentle aspect to the Moon creates a dreamlike atmosphere. It's an ideal time for meditation, creative projects, and deep conversations. Your boundaries might feel permeable, so choose your environment wisely.",
      focus: "Creative expression and spiritual connection.",
      caution: "Avoid overextending yourself in social obligations."
    },
    {
      title: "The Assertive Push",
      summary: "Energy is high and momentum is building. Mars provides the drive needed to tackle long-standing challenges.",
      full: "With Mars transiting through a fire sign today, you'll feel an unusual burst of motivation. This is the perfect window to initiate new projects or have difficult conversations. The cosmic energy favors the bold.",
      focus: "Personal projects and physical activity.",
      caution: "Temper your impulsiveness to avoid unnecessary friction."
    },
    {
      title: "The Analytical Shift",
      summary: "Mercury's position favors logical thinking and clear communication. A great day for planning and organization.",
      full: "The stars align to bring laser-like focus to your mental processes. Contracts, detailed plans, and technical work are highly favored. You may find that complex problems suddenly yield simple solutions.",
      focus: "Organizational tasks and strategic planning.",
      caution: "Don't lose sight of the bigger picture by obsessing over details."
    },
    {
      title: "The Social Harmony",
      summary: "Venus brings a sense of balance and charm to your interactions. Focus on building bridges and nurturing relationships.",
      full: "A beautiful day for social connection. Whether in business or personal life, your ability to empathize and charm is at its peak. It's a prime time for networking or deepening a romantic bond.",
      focus: "Relationship building and aesthetic pursuits.",
      caution: "Ensure you aren't sacrificing your own needs just to keep the peace."
    }
  ];

  const dailyVibe = vibes[seed % vibes.length];

  return NextResponse.json({
    date: dateString,
    ...dailyVibe
  });
}
