import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { sun, moon, rising, name } = await req.json();

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // Use Gemini if key is available
    if (GEMINI_API_KEY) {
      const prompt = `Generate a short, mystical, and deeply personalized birth chart reading for someone named ${name}. 
      Their Sun is in ${sun}, Moon is in ${moon}, and Rising is in ${rising}. 
      Make it feel cosmic and AI-native. Max 3-4 sentences.`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return NextResponse.json({ reading: text });
      }
    }

    // Fallback if Gemini key is not set or fails
    const mockReadings = [
      `As a ${sun} Sun with a ${moon} Moon, you possess a rare balance of fiery drive and deep emotional resonance. Your ${rising} Rising projects a persona of polished grace, making you a natural bridge between worlds.`,
      `The celestial geometry at your birth suggests your ${sun} essence is amplified by the reflective depth of your ${moon} sign. With ${rising} ascending, the universe invites you to lead with your intuition and trust your path.`,
      `Your cosmic blueprint, marked by ${sun} and ${moon}, indicates a soul that flourishes in the space between action and reflection. Your ${rising} Rising ensures you move through the world with cosmic purpose.`
    ];

    const randomIdx = (sun.length + moon.length + rising.length) % mockReadings.length;
    return NextResponse.json({ reading: mockReadings[randomIdx] });

  } catch (err) {
    console.error('AI Reading Error:', err);
    return NextResponse.json({ error: 'Failed to generate cosmic insight' }, { status: 500 });
  }
}
