import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({
  text: z.string().min(1).max(300),
  speed: z.number().min(0.25).max(1.5).default(0.7),
});

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return Response.json({ error: "AI key not configured" }, { status: 401 });
        }

        let parsed;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input: parsed.text,
            voice: "alloy",
            speed: parsed.speed,
            response_format: "mp3",
            instructions:
              "Speak clearly and slowly in a friendly American English accent, for a beginner learner.",
          }),
        });

        if (!upstream.ok) {
          const detail = await upstream.text().catch(() => "");
          return Response.json(
            { error: detail || "TTS failed" },
            { status: upstream.status },
          );
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
