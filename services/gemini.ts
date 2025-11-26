import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePixelStory = async (theme: string = "jungle sunset"): Promise<{ title: string; content: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a short, atmospheric lore description (max 100 words) and a catchy title for a pixel art scene depicting a ${theme}. 
      Return the response in JSON format with keys: "title" and "content".
      The tone should be nostalgic, adventurous, and relaxing.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const json = JSON.parse(text);
    return {
      title: json.title || "Unknown Realm",
      content: json.content || "A mysterious pixelated landscape awaits your exploration."
    };
  } catch (error) {
    console.error("Error generating story:", error);
    return {
      title: "Connection Lost",
      content: "The signal from the retroverse is weak. Unable to retrieve data."
    };
  }
};

export const generatePixelArt = async (prompt: string): Promise<string | null> => {
  try {
    // Using gemini-2.5-flash-image (Nano Banana) for generation as per guidelines for general tasks
    const finalPrompt = `pixel art style, 16-bit retro game aesthetic, ${prompt}. vibrant colors, clean lines, high quality`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};