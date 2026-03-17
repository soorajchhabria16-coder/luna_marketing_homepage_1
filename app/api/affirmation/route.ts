import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { sunSign, moonSign, currentPhase } = await req.json();

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      const prompt = `Create a deeply personal and mystical lunar affirmation for someone with:
      - Sun Sign: ${sunSign}
      - Moon Sign: ${moonSign}
      - Current Moon Phase they are working with: ${currentPhase}
      
      The affirmation should:
      1. Be 2-3 sentences long.
      2. Be written in first-person ("I am...", "I trust...", "I call in...").
      3. Specifically reference their sun and moon signs in a poetic, cosmic way.
      4. Align with the energy of the ${currentPhase} phase (e.g., release for Full Moon, seed-setting for New Moon).
      5. Feel premium, mystical, and deeply personal — not generic.
      
      Return only the affirmation text, no quotes, no preamble.`;

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
        if (text) return NextResponse.json({ affirmation: text.trim() });
      }
    }

    // Fallback affirmations keyed by phase
    const fallbacks: Record<string, string[]> = {
      'New Moon': [
        `As a ${sunSign} soul, I plant my deepest intentions into the fertile darkness. My ${moonSign} heart guides me to trust what I cannot yet see, knowing the universe conspires in my favor.`,
        `I am the seed and the gardener. In this sacred darkness, my ${sunSign} fire meets my ${moonSign} knowing, and together they birth a new reality.`
      ],
      'Waxing Moon': [
        `I take bold, inspired action from the heart of my ${sunSign} nature. My ${moonSign} intuition lights each step as the moon — and I — expand toward our fullness.`,
        `With ${sunSign} strength and ${moonSign} grace, I gather momentum. Every effort I make is amplified by the rising lunar tide.`
      ],
      'Full Moon': [
        `Under this luminous sky, I release all that my ${sunSign} spirit has outgrown. My ${moonSign} soul is renewed — lighter, clearer, and wide open to what is meant for me.`,
        `I am illuminated. As a ${sunSign} being, I stand in my full power, and my ${moonSign} heart releases what it no longer needs to carry.`
      ],
      'Waning Moon': [
        `With graceful ${sunSign} sovereignty, I surrender what is not mine to hold. My ${moonSign} wisdom knows the beauty in the letting go, as I return to the sacred stillness.`,
        `I trust the cycle. My ${sunSign} essence rests, and my ${moonSign} nature peacefully sheds the old to prepare the field for the new.`
      ]
    };

    const options = fallbacks[currentPhase] || fallbacks['Full Moon'];
    const affirmation = options[Math.floor(Math.random() * options.length)];

    return NextResponse.json({ affirmation });

  } catch (err) {
    console.error('Affirmation Generation Error:', err);
    return NextResponse.json({ error: 'Failed to generate lunar affirmation' }, { status: 500 });
  }
}
