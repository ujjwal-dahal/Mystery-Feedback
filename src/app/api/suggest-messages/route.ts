import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// DeepSeek API setup गर्दै
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY, // DeepSeek को API key प्रयोग गर्ने
  baseURL: "https://api.deepseek.com/v1", // DeepSeek को API URL
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

     // DeepSeek को लागि streaming request
     const response = await openai.chat.completions.create({
      model: 'deepseek-chat', // DeepSeek को model प्रयोग गर्दै
      max_tokens: 400,
      stream: true,
      messages: [{ role: 'user', content: prompt }], // DeepSeek ले message format माग्छ
    });

    let completeText = '';

    for await (const chunk of response) {
      if (chunk?.choices[0]?.delta?.content) {
        completeText += chunk.choices[0].delta.content; // Content लाई delta मा पाउने
      }
    }

    return new NextResponse(JSON.stringify({ text: completeText }), { 
      status: 200 
    });

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // Error handling यस्तै रहन्छ
      const { message } = error;
      return NextResponse.json({ message }, { status: 500 });
    } else {
      console.error('अल्लै error आयो:', error);
      throw error;
    }
  }
}