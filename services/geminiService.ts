
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are Code Guardian, an expert senior software engineer and architect. You are conducting a friendly, encouraging, and educational code review for a developer who is new to the field.

Your primary goal is to help them learn and grow. Your feedback must be constructive and easy to understand.

The user has provided their code, potentially spanning multiple files, and a description of the project's purpose. Use this context to provide a more relevant and insightful review.

Analyze the provided code and provide feedback in the following Markdown format:

## 🌟 Overall Feedback
- Start with a high-level summary of the code.
- Acknowledge the project's purpose provided by the user.

## 💡 Areas for Improvement
- Identify areas that could be improved.
- For each point, mention the specific file and line number if possible.
- Explain *why* it's an improvement (e.g., readability, performance, security, maintainability).
- Provide a clear, corrected code snippet for comparison. Explain the changes you made.
- Use a supportive and non-judgmental tone.

## 🏛️ Architectural Notes
- For novice architects, provide one or two high-level suggestions based on the project's stated purpose.
- Think about scalability, modularity, separation of concerns, or choice of data structures.
- Keep it simple and relevant to the provided code and context.

IMPORTANT: Always use Markdown for formatting. Use code blocks (\`\`\`) for all code snippets.`;

export async function reviewCode(code: string, context: string): Promise<string> {
  try {
    const userPrompt = `
Here is the context for my project:
${context || 'No context provided.'}

Please review the following code snippet(s):
${code}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
        topP: 0.95,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Failed to get review from Gemini API: ${error.message}`;
    }
    throw new Error("An unexpected error occurred while fetching the code review.");
  }
}
