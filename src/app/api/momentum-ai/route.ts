import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

type MomentumAIRequest = {
  builderType: string;
  streak: number;
  consistency: number;
  logs: string[];
  projects?: string[];
  proofOfWork: string;
  focusArea?: string;
  currentMission?: string;
  level: number;
  xp: number;
};

type MomentumAIResponse = {
  recommendation: string;
  why: string;
  estimatedEffort: string;
  raw: string;
};

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const systemPrompt = `You are Momentum AI, a builder growth mentor. You are concise, motivating, modern, and mentor-like. Do not act like a chatbot. Do not use long paragraphs. Focus on a single personalized next move, why it matters, and estimated effort. Output in short labeled lines only.`;

const formatUserPrompt = (body: MomentumAIRequest) => `Builder Type: ${body.builderType}
Streak: ${body.streak} days
Consistency: ${body.consistency}
Current Mission: ${body.currentMission || 'none'}
Proof of Work: ${body.proofOfWork}
Focus Area: ${body.focusArea || 'general'}
Projects: ${body.projects && body.projects.length > 0 ? body.projects.join(', ') : 'none'}
Recent Logs:
${body.logs.length > 0 ? body.logs.map((log) => `- ${log}`).join('\n') : '- none'}

Give a compact recommendation, explain why it matters, and estimate the effort in a builder mentor tone.`;

const parseAIText = (text: string): MomentumAIResponse => {
  const lines = text
    .split(/\r?\n/) 
    .map((line) => line.trim())
    .filter(Boolean);

  let recommendation = '';
  let why = '';
  let estimatedEffort = '';

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.startsWith('next move:') || lower.startsWith('recommended next move:') || lower.startsWith('recommended move:')) {
      recommendation = line.split(':').slice(1).join(':').trim();
      continue;
    }
    if (lower.startsWith('why')) {
      why = line.split(':').slice(1).join(':').trim();
      continue;
    }
    if (lower.startsWith('estimated effort:') || lower.startsWith('effort:')) {
      estimatedEffort = line.split(':').slice(1).join(':').trim();
      continue;
    }
    if (!recommendation) {
      recommendation = line;
    } else if (!why) {
      why = line;
    } else if (!estimatedEffort) {
      estimatedEffort = line;
    }
  }

  return {
    recommendation: recommendation || 'Focus your next build on proof of work.',
    why: why || 'This keeps your momentum aligned with proof of work and consistency.',
    estimatedEffort: estimatedEffort || 'short sprint',
    raw: text
  };
};

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ message: 'Missing GROQ_API_KEY in environment.' }, { status: 500 });
  }

  const body = (await request.json()) as MomentumAIRequest;

  if (!body.builderType || typeof body.streak !== 'number') {
    return NextResponse.json({ message: 'Invalid request payload.' }, { status: 400 });
  }

  try {
    const userPrompt = formatUserPrompt(body);
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 180,
      temperature: 0.2,
      top_p: 0.9
    });

    const text = completion.choices?.[0]?.message?.content?.trim() || '';
    const parsed = parseAIText(text);

    return NextResponse.json(parsed);
  } catch (error: any) {
    const message = error?.message || 'Momentum AI request failed.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
