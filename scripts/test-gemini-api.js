#!/usr/bin/env node

/**
 * Test Gemini API Connection
 *
 * This script tests your Google AI Studio API key and lists available models
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCqbDabQwPvabz-IBOujmqn6VCo82vwKkg";

async function testGeminiAPI() {
  console.log("🧪 Testing Gemini API Connection\n");
  console.log("=".repeat(60));

  if (!API_KEY) {
    console.log("❌ No API key found!");
    console.log("Please add API_KEY to your .env.local file\n");
    return;
  }

  console.log("✅ API Key found:", API_KEY.substring(0, 20) + "...");
  console.log("\n📋 Testing models...\n");

  const genAI = new GoogleGenerativeAI(API_KEY);

  const modelsToTest = [
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-pro",
    "gemini-pro-vision",
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      // Try a simple text generation
      const result = await model.generateContent("Say hello in one word");
      const response = await result.response;
      const text = response.text();

      console.log(`  ✅ ${modelName} works! Response: "${text.trim()}"`);
      console.log(`  👍 Use this model in your script!\n`);
      return modelName; // Return first working model
    } catch (error) {
      console.log(
        `  ❌ ${modelName} failed: ${error.message.substring(0, 100)}...\n`
      );
    }
  }

  console.log("\n❌ No working models found!");
  console.log("\n💡 Possible issues:");
  console.log("1. Your API key might be invalid or expired");
  console.log(
    "2. You might need to enable the Gemini API in Google Cloud Console"
  );
  console.log("3. Your API key might be for a different region");
  console.log("\n📝 To fix:");
  console.log("1. Go to: https://makersuite.google.com/app/apikey");
  console.log("2. Create a new API key");
  console.log("3. Add it to .env.local: API_KEY=your-key-here");
}

testGeminiAPI().catch(console.error);
