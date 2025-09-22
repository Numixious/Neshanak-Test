
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Use a simple lazy initializer to avoid crashing the app on load if API_KEY is not set.
let ai: GoogleGenAI | null = null;

function getAiInstance(): GoogleGenAI | null {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set");
        return null;
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}


const writingImagePrompts = [
    "A happy cartoon lion waving",
    "A colorful friendly robot playing with a ball",
    "A cute red car on a sunny day under a rainbow",
    "Two friendly cartoon squirrels sharing an acorn on a branch",
    "A smiling cartoon sun wearing sunglasses",
    "A purple cartoon monster with three eyes eating a cookie"
];

const API_KEY_ERROR_MESSAGE = "کلید API تنظیم نشده است. لطفاً مدیر سایت را مطلع کنید.";
const GENERAL_ERROR_MESSAGE_STORY = "متاسفانه مشکلی در ساختن داستان پیش آمد. لطفا دوباره تلاش کن.";
const GENERAL_ERROR_MESSAGE_IMAGE = "Failed to generate image.";
const GENERAL_ERROR_MESSAGE_FEEDBACK = "متاسفانه در بررسی نوشته‌ات مشکلی پیش آمد. لطفا دوباره تلاش کن.";

export async function generateStory(topic: string): Promise<string> {
  const aiInstance = getAiInstance();
  if (!aiInstance) {
    return API_KEY_ERROR_MESSAGE;
  }

  try {
    const response: GenerateContentResponse = await aiInstance.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `یک داستان کوتاه و بسیار ساده در مورد "${topic}" برایم بنویس.`,
      config: {
        systemInstruction: "شما یک داستان‌نویس برای کودکان ۶ تا ۱۰ ساله هستید که در خواندن مشکل دارند. از کلمات کاملا ساده، جملات کوتاه و لحنی مثبت و دلگرم‌کننده استفاده کنید. تمام پاسخ‌ها باید به زبان فارسی باشد. داستان نباید بیشتر از ۱۰۰ کلمه باشد.",
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating story:", error);
    return GENERAL_ERROR_MESSAGE_STORY;
  }
}

export async function generateImageForWriting(): Promise<{ prompt: string; imageB64: string }> {
  const aiInstance = getAiInstance();
  if (!aiInstance) {
    throw new Error(API_KEY_ERROR_MESSAGE);
  }

  const prompt = writingImagePrompts[Math.floor(Math.random() * writingImagePrompts.length)];
  try {
    const response = await aiInstance.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Cute, simple, vibrant color, cartoon style for kids: ${prompt}`,
        config: {numberOfImages: 1, outputMimeType: 'image/jpeg'},
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return { prompt, imageB64: base64ImageBytes };
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error(GENERAL_ERROR_MESSAGE_IMAGE);
  }
}

export async function getWritingFeedback(userText: string, imagePrompt: string): Promise<string> {
    if (!userText.trim()) {
        return "یادت نره که در مورد تصویر یک جمله بنویسی!";
    }

    const aiInstance = getAiInstance();
    if (!aiInstance) {
        return API_KEY_ERROR_MESSAGE;
    }

  try {
    const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `یک کودک در مورد تصویری از "${imagePrompt}" این جمله را نوشته است: "${userText}". لطفاً با لحنی بسیار مهربان و تشویق‌آمیز، ابتدا او را تحسین کن و سپس شکل درست جمله را برایش بنویس. پاسخ تو باید کوتاه و مثبت باشد. فقط جمله ی اصلاح شده و پیام تشویقی را بنویس.`,
        config: {
            systemInstruction: "You are a kind and encouraging teacher for a child with writing difficulties. Your response must be in Persian. First, praise the child's effort. Then, gently provide the corrected version of their text. Keep your feedback very short, positive, and simple. For example: 'آفرین! خیلی خوب نوشتی. این هم شکل درستش است: [CORRECTED TEXT]'",
            temperature: 0.3,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error getting writing feedback:", error);
    return GENERAL_ERROR_MESSAGE_FEEDBACK;
  }
}