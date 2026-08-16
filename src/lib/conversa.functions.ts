import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  scenario: z.string().min(1).max(200),
  level: z.enum(["basic", "intermediate", "advanced"]).default("basic"),
  nativeLanguage: z.enum(["pt", "es", "en"]).default("pt"),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(1200),
      }),
    )
    .max(30),
});

const NATIVE_LABEL = {
  pt: "português brasileiro",
  es: "español",
  en: "English",
} as const;

export const chatWithTutor = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { reply: "", tip: "", error: "AI indisponível" };

    const system = [
      `You are an upbeat English tutor role-playing this scenario: "${data.scenario}".`,
      `The learner's native language is ${NATIVE_LABEL[data.nativeLanguage]} and their level is ${data.level}.`,
      "Always answer in-character in simple English (max 2 short sentences).",
      "Then give one very short pronunciation/grammar tip written in the learner's native language.",
      'Reply ONLY with JSON: {"reply":"...","tip":"...","score":0-100}.',
    ].join(" ");

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: system }, ...data.messages],
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(`AI gateway failed [${res.status}]: ${body}`);
        return { reply: "", tip: "", error: `AI ${res.status}` };
      }

      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const raw = json.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as { reply?: string; tip?: string; score?: number };

      return {
        reply: parsed.reply ?? "",
        tip: parsed.tip ?? "",
        score: typeof parsed.score === "number" ? Math.round(parsed.score) : 85,
        error: null as string | null,
      };
    } catch (err) {
      console.error("chatWithTutor error", err);
      return { reply: "", tip: "", error: "AI error" };
    }
  });
