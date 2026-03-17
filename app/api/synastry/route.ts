import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { chart1, chart2 } = await req.json();

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const person1Info = `${chart1.name} (Sun: ${chart1.sun_sign}, Moon: ${chart1.moon_sign}, Rising: ${chart1.rising_sign})`;
    const person2Info = `${chart2.name} (Sun: ${chart2.sun_sign}, Moon: ${chart2.moon_sign}, Rising: ${chart2.rising_sign})`;

    if (GEMINI_API_KEY) {
      const prompt = `Perform a deep Synastry (astrological compatibility) analysis between two individuals:
      Person 1: ${person1Info}
      Person 2: ${person2Info}
      
      Provide:
      1. A compatibility score (0-100).
      2. A short summary of their relationship dynamic (2-3 sentences).
      3. Scores (percentage) for: Communication, Romance, and Creative Synergy.
      4. A "Relationship Timeline" of 3 upcoming cosmic events (dates in the next 3 months) that will specifically impact this pair's connection.
      
      Return as a JSON object:
      {
        "score": number,
        "summary": "string",
        "stats": {
          "communication": number,
          "romance": number,
          "synergy": number
        },
        "timeline": [
          { "date": "string", "event": "string", "impact": "string", "intensity": "low" | "medium" | "high" }
        ]
      }`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: "application/json" }
          })
        }
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return NextResponse.json(JSON.parse(text));
      }
    }

    // Fallback logic
    const score = Math.floor(Math.random() * 30) + 65; // 65-95
    return NextResponse.json({
      score,
      summary: `The alignment between ${chart1.name} and ${chart2.name} suggests a soul-level connection. Their ${chart1.sun_sign} and ${chart2.sun_sign} energies create a harmonious dance of shared values and mutual growth.`,
      stats: {
        communication: Math.floor(Math.random() * 20) + 75,
        romance: Math.floor(Math.random() * 20) + 70,
        synergy: Math.floor(Math.random() * 20) + 65
      },
      timeline: [
        { date: "April 15, 2026", event: "Mercury Retrograde Junction", impact: "A period for revisiting old promises and refining shared goals.", intensity: "medium" },
        { date: "May 2, 2026", event: "Venus-Jupiter Opposition", impact: "Expect a surge in romantic intensity and creative collaboration.", intensity: "high" },
        { date: "June 12, 2026", event: "Saturnian Trine", impact: "A stabilization of long-term commitment and structural growth.", intensity: "medium" }
      ]
    });

  } catch (err) {
    console.error('Synastry Analysis Error:', err);
    return NextResponse.json({ error: 'Failed to analyze divine connection' }, { status: 500 });
  }
}
