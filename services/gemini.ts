
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAcademicAdvice = async (userPrompt: string, studentContext: any) => {
  const ai = getAI();
  const contextString = JSON.stringify(studentContext);
  
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
};

export const extractStudentDetailsFromImage = async (base64Image: string, mimeType: string) => {
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
    
    If specific marks aren't visible, estimate or use null. Be precise with the names from the table.
  `;

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

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};
