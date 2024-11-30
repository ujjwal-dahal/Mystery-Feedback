import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge'; // Set runtime to edge

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Define the prompt
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Create a streaming completion request
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo',
      prompt,
      max_tokens: 400,
      stream: true, // Enable streaming
    });

    // Stream the response tokens
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          // Enqueue each chunk of the streamed response
          controller.enqueue(new TextEncoder().encode(chunk.choices[0].text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    } else {
      console.error('Unknown error occurred:', error);
      return NextResponse.json(
        { error: 'An unknown error occurred. Please try again.' },
        { status: 500 }
      );
    }
  }
}
