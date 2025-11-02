import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { VOLUME_LANDMARKS } from '@/lib/volume-landmarks';
import { ProgramGenerationRequest, GeneratedProgram } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body: ProgramGenerationRequest = await request.json();
    const { frequency, sex, goals, weakPoints, training_level = 'intermediate' } = body;

    if (!frequency || !sex || !goals) {
      return NextResponse.json(
        { error: 'Missing required fields: frequency, sex, goals' },
        { status: 400 }
      );
    }

    // Build prompt with training context
    const prompt = `You are an expert strength and hypertrophy coach. Generate a personalized training program based on Renaissance Periodization principles.

USER PROFILE:
- Training Frequency: ${frequency} days per week
- Sex: ${sex}
- Training Level: ${training_level}
- Goals: ${goals}
- Weak Points/Priority Areas: ${weakPoints || 'None specified'}

VOLUME LANDMARKS (sets per week per muscle group):
${JSON.stringify(VOLUME_LANDMARKS, null, 2)}

INSTRUCTIONS:
1. Create a ${frequency}-day training split optimized for the user's goals
2. Respect the volume landmarks - stay within MAV range (Maximum Adaptive Volume)
3. For weak points, use upper MAV range; for other muscles, use middle MAV range
4. Include compound movements first, then isolation work
5. Specify sets (not including warm-up), rep ranges, and brief exercise notes
6. Choose appropriate split type: PPL (Push/Pull/Legs), Upper-Lower, or Full Body

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "program_name": "Descriptive name for this program",
  "split_type": "PPL" | "Upper-Lower" | "Full Body",
  "days": [
    {
      "day_number": 1,
      "focus": "e.g., Push, Pull, Legs, Upper, Lower, Full Body",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": number,
          "rep_range": "e.g., 8-12",
          "notes": "Brief technique or emphasis notes"
        }
      ]
    }
  ],
  "rationale": "1-2 sentence explanation of why this split works for the user"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse JSON from response
    let programData: GeneratedProgram;
    try {
      // Try to extract JSON if Claude wrapped it in markdown
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content.text;
      programData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', content.text);
      throw new Error('Failed to parse program data from Claude response');
    }

    return NextResponse.json(programData);
  } catch (error: any) {
    console.error('Error generating program:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate program' },
      { status: 500 }
    );
  }
}
