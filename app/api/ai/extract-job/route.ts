import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'AI Extraction Key not configured.' }, { status: 500 });
    }

    const prompt = `
Extract structured job data from the following input.

Return ONLY valid JSON.

Fields:
- title
- description
- budget (number only, do not include symbols)
- location (name of the place)
- category (main skill needed, e.g., Harvesting, Weeding)
- requirements (list of skills or items)

Input:
"""
${text}
"""

Rules:
- Infer missing values if possible
- Keep output clean JSON
- Do not include explanation
- Budget should be a number (daily wage)
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();
    const resultText = data.choices[0].message.content;

    try {
      const parsedData = JSON.parse(resultText);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error('Failed to parse AI response:', resultText);
      return NextResponse.json({ error: 'Failed to extract structured data' }, { status: 500 });
    }
  } catch (error) {
    console.error('AI Extraction Error:', error);
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 });
  }
}
