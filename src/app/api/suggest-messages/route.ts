import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Create the streaming request
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 400,
      stream: true,
      prompt,
    });

    let completeText = '';

    for await (const chunk of response) {
      if (chunk?.choices) {
        completeText += chunk.choices[0]?.text || '';
      }
    }

    
    return new NextResponse(JSON.stringify({ text: completeText }), { status: 200 });

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // Handle OpenAI API errors
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      // Handle unexpected errors
      console.error('An unexpected error occurred:', error);
      throw error;
    }
  }
}
