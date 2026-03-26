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
Extract structured job data from the following input for a farm labor marketplace.

Return ONLY valid JSON.

Fields:
- title: Short catchy job title
- description: Detailed description
- wage_amount: Daily wage per person (number only, no symbols)
- workers_needed: Number of workers required (number only)
- start_date: Expected job start date (YYYY-MM-DD or relative like "tomorrow", "Monday")
- number_of_days: Duration of work in days (number only, default 1)
- farm_name: Name of the farm if mentioned
- location: General location or village
- category: Main skill (Harvesting, Weeding, Pesticide, etc.)
- requirements: List of skills or items needed

Input:
"""
${text}
"""

Rules:
- Infer missing values if possible.
- Budget/Wage must be a number.
- Workers needed must be a number.
- For date: if "tomorrow", calculate based on ${new Date().toLocaleDateString()}.
- If no farm name mentioned, leave field empty.
- Keep output clean JSON.
- Do not include explanation.
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
