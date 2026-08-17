// Gemini AI integration — install @google/generative-ai when API key is ready
export const getMysticalInsight = async (prompt: string): Promise<string> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return "The cosmic energies are currently resting. Add GEMINI_API_KEY to enable AI insights."

    const { GoogleGenerativeAI } = await import("@google/generative-ai" as any)
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch {
    return "The cosmic energies are currently clouded. Please try again when the stars align."
  }
}
