import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'
import { PerfectDayAnswers, DivePlan } from '@/types/agent'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Auth guard
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const answers: PerfectDayAnswers = body.answers
    const locale: string = body.locale || 'en'

    // Fetch dive sites (all for now, filter by difficulty in prompt)
    const { data: sites, error: sitesError } = await supabase
      .from('dive_sites')
      .select('*')
      .limit(10)

    if (sitesError || !sites) {
      console.error('Supabase fetch sites error:', sitesError)
      return NextResponse.json(
        { error: 'Failed to fetch dive sites' },
        { status: 500 }
      )
    }

    // Fetch instructors
    const { data: instructors, error: instructorsError } = await supabase
      .from('users')
      .select('id, first_name, last_name')
      .eq('diving_experience', 'instructor')
      .limit(6)

    if (instructorsError) {
      console.error('Supabase fetch instructors error:', instructorsError)
    }

    // Build prompt
    const language = locale === 'he' ? 'Hebrew' : 'English'

    const systemPrompt = `You are a dive planning assistant for DiveDrop, a scuba diving companion app.
Your job is to recommend a perfect dive site and instructors based on the diver's profile.
Always respond with ONLY valid JSON, no markdown, no explanation.`

    const userPrompt = `
Diver profile:
- Experience Level: ${answers.experienceLevel}
- Goal for today: ${answers.goal}
- Wants instructor: ${answers.guidePreference}
- Preferred language: ${language}

Available dive sites:
${JSON.stringify(sites, null, 2)}

Available instructors:
${JSON.stringify(instructors || [], null, 2)}

Please recommend:
1. The best matching dive site
2. Appropriate instructors (0-3 based on preference)
3. A personalized 2-3 sentence recommendation message (in ${language})
4. 3 practical tips for this dive

Return ONLY this exact JSON structure (no other text):
{
  "siteId": "uuid-string",
  "siteName": "string",
  "siteDepth": number,
  "siteDifficulty": "string",
  "siteLocation": "string",
  "instructors": [{"id":"uuid","firstName":"string","lastName":"string"}],
  "message": "personalized message in ${language}",
  "tips": ["tip1", "tip2", "tip3"]
}
`

    // Call Claude Haiku
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 400,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    // Extract JSON from response
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    let plan: DivePlan
    try {
      plan = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse Claude response:', responseText)
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Perfect day API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
