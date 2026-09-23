// PetPal: AI-generated training tips fallback (Stage 9). Called from
// Training.jsx via supabase.functions.invoke('generate-training-tips', ...)
// whenever a pet's specific breed isn't covered by the hand-written tips in
// src/trainingTips.js. Keeps the Anthropic API key server-side -- it's never
// shipped to the browser.
//
// Deploy with: npx supabase functions deploy generate-training-tips
// Requires the ANTHROPIC_API_KEY secret to be set first (see README note in
// the deploy instructions) -- this function returns a clear 500 if it's missing.

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!ANTHROPIC_API_KEY) {
    return jsonResponse(
      { error: 'ANTHROPIC_API_KEY is not configured for this Supabase project.' },
      500,
    )
  }

  let species: string | undefined
  let breed: string | undefined

  try {
    const body = await req.json()
    species = body.species
    breed = body.breed
  } catch {
    return jsonResponse({ error: 'Expected a JSON body with { species, breed }.' }, 400)
  }

  if (!species) {
    return jsonResponse({ error: 'species is required.' }, 400)
  }

  const subject = breed ? `a ${breed} (${species.toLowerCase()})` : `a ${species.toLowerCase()}`

  const prompt = `You are an expert professional pet trainer writing for a pet-care app called PetPal. Write 2 in-depth training topics for ${subject}, focused on traits distinctive to this breed/species (temperament, energy level, common behavioral challenges) rather than generic advice that would apply to any pet.

Each topic needs real depth: a proper step-by-step technique an owner could actually follow, the mistakes that commonly undermine it, and a realistic timeline. Do not write short generic blurbs.

Respond with ONLY a JSON array (no markdown, no code fences, no commentary) of exactly 2 objects shaped like:
[{
  "title": "Short topic title",
  "overview": "1-2 sentences on what this is and why it matters for this breed/species specifically",
  "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "mistakes": ["Common mistake 1", "Common mistake 2"],
  "timeline": "A realistic sentence on how long this takes"
}]`

  try {
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text()
      return jsonResponse({ error: `Anthropic API error: ${errorText}` }, 502)
    }

    const anthropicData = await anthropicResponse.json()
    const rawText: string = anthropicData.content?.[0]?.text ?? '[]'

    let tips
    try {
      tips = JSON.parse(rawText)
    } catch {
      // Model didn't return clean JSON -- show it as a single topic rather
      // than failing outright.
      tips = [{ title: `Tips for ${subject}`, overview: rawText }]
    }

    return jsonResponse({ tips })
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : String(error) }, 500)
  }
})
