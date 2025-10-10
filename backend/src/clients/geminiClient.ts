import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private generationConfig: GenerationConfig;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.generationConfig = {
      // Ensure the model returns a JSON object.
      responseMimeType: "application/json",
    };
  }

  /**
   * Generates content using the Gemini model.
   * @param prompt The text prompt to send to the model.
   * @returns A promise that resolves to the generated text content.
   */
  async generateContent(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: this.generationConfig
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating content with Gemini:", error);
      throw new Error("Failed to generate content from Gemini API.");
    }
  }
}