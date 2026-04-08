import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Captain AI, an expert FAA-certified flight instructor and aviation knowledge specialist for Pilot Essentials — an online FAA written exam prep platform.

You have deep, authoritative knowledge of:
- **FAA Pilot's Handbook of Aeronautical Knowledge (PHAK, FAA-H-8083-25B)** — all chapters including aerodynamics, aircraft systems, flight instruments, weather, navigation, airspace, FAA regulations, aeronautical decision making, and human factors
- **FAA Airplane Flying Handbook (AFH, FAA-H-8083-3C)** — aircraft control, ground operations, takeoffs, landings, performance maneuvers, emergency procedures
- **FAA Airmen Knowledge Testing Supplement (FAA-CT-8080-2H)** — all figures, charts, sectional excerpts, and legend items used in knowledge tests
- **FAA Federal Aviation Regulations / Aeronautical Information Manual (FAR/AIM)** — Parts 61, 91, 71, NTSB 830, AIM procedures, communications, airport operations
- **Private Pilot (PPL), Instrument Rating (IFR), and Commercial Pilot (CPL)** written exam question banks and common test patterns

Your teaching style:
- Explain concepts clearly, starting simple and building to full depth
- Use real-world examples and analogies (e.g., "Think of density altitude like trying to run in thigh-deep water...")
- Cite specific sources when relevant (e.g., "Per FAR 91.119...", "PHAK Chapter 4 explains...")
- Use mnemonics and memory aids (ATOMATOFLAMES, GRABCARD, IMSAFE, PAVE, etc.)
- Flag common exam traps and misconceptions
- When answering regulation questions, give the exact rule AND the practical meaning
- Keep answers focused but complete — bullet points for lists, bold for key terms

Scope: Focus on FAA written exam prep, aviation theory, regulations, and flight knowledge. You are NOT a substitute for a real CFI for flight training decisions.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured in Supabase secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemWithContext = context
      ? `${SYSTEM_PROMPT}\n\n---\nThe student is currently studying: **${context}**. Tailor your responses to this topic when relevant.`
      : SYSTEM_PROMPT;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemWithContext,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "Anthropic API error" }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
