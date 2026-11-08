import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI();

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1].content;

    // Obosshoi ekhane gemini-3.8-flash dite hobe
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: lastMessage,
    });

    const aiResponse = response.text;

    return NextResponse.json({ reply: aiResponse });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong with Gemini API." },
      { status: 500 }
    );
  }
}