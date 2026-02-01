
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants.ts";

const getAI = () => {
  let apiKey = "";
  try {
    // We strictly use API_KEY as per instructions
    apiKey = (window as any).process?.env?.API_KEY || "";
    
    if (!apiKey) {
      console.warn("⚠️ API_KEY is missing from environment variables.");
    }
  } catch (e) {
    apiKey = "";
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAcademicAdvice = async (userPrompt: string, studentContext: any) => {
  const apiKey = (window as any).process?.env?.API_KEY;
  
  if (!apiKey) {
    return "Error: Gemini API Key not found. Please rename your Vercel environment variable to 'API_KEY'.";
  }

  const ai = getAI();
  const contextString = JSON.stringify(studentContext);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Student Context: ${contextString}\n\nUser Question: ${userPrompt}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "I'm sorry, I couldn't process that. Please try again.";
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      return "Invalid API Key. Please check your Google AI Studio key.";
    }
    return "The AI Advisor is currently offline. Check your console for details.";
  }
};

export const extractStudentDetailsFromImage = async (base64Image: string, mimeType: string) => {
  const apiKey = (window as any).process?.env?.API_KEY;
  if (!apiKey) return null;

  const ai = getAI();
  const prompt = `
    Analyze this KITSW Student Portal screenshot. Extract the student identity and the full academic marks table.
    
    Return ONLY valid JSON with this structure:
    {
      "name": "string",
      "rollNumber": "string",
      "branch": "CSE|CSM|CSO|CSD|ECE|EEE|ME|CE|IT",
      "semester": number,
      "cgpa": number,
      "attendance": number,
      "courses": [
        {
          "code": "string",
          "name": "string (e.g. BEE, COA, PPSC)",
          "cie": number (Total out of 150),
          "mse": number (MSE marks out of 50),
          "minors": [number, number],
          "gcbaa": number
        }
      ],
      "activities": {
        "sea": number (Total out of 100),
        "practicum": number (Total out of 100)
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: base64Image, mimeType } }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return null;
    
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Failed to parse AI response or process image", e);
    return null;
  }
};
