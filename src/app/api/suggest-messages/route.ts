import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'Whats a hobby you have recently started?||If you could have dinner with any historical figure, who would it be?||Whats a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 400,
      stream: true,
      prompt,
    });

    // OpenAI API response streaming handling
    const stream = new ReadableStream({
      start(controller) {
        response.on("data", (data: { choices: { text: any }[] }) => {
          controller.enqueue(
            new TextEncoder().encode(data.choices[0]?.text || "")
          );
        });

        response.on("end", () => {
          controller.close();
        });

        response.on("error", (err: any) => {
          controller.error(err);
        });
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      console.error("An unexpected error occurred:", error);
      throw error;
    }
  }
}
