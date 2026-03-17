import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return NextResponse.json({ 
        text: "I'm currently resting among the stars (Groq API key missing). Please try again later!", 
        isAi: true 
      });
    }

    const systemPrompt = "You are Luna, a mystical and wise AI Astro-Guide for the 'Luna' app. " +
      "You speak with a celestial, encouraging, and slightly poetic tone. " +
      "You are an expert in Astrology, Birth Charts, Moon Phases, and Lunar Rituals. " +
      "You can speak any language fluently (Urdu, English, Hindi, etc.). " +
      "Keep your responses relatively concise but deeply insightful. " +
      "If a user asks about the app, tell them we offer personalized birth charts, daily vibes, and interactive star maps.";

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.isAi ? 'assistant' : 'user',
        content: m.text
      }))
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error('Groq API failure');
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content;

    if (!aiText) {
      throw new Error('No response from Groq');
    }

    return NextResponse.json({ text: aiText, isAi: true });

  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ 
      text: "The cosmic signals are a bit fuzzy right now. Let's try again in a moment.", 
      isAi: true 
    }, { status: 500 });
  }
}
