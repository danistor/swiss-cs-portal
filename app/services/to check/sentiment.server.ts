// In a real app, you would use an AI service API
// This is a simplified mock implementation
export async function analyzeSentiment(text: string): Promise<number> {
  // Mock implementation for now
  // Returns a score between -1 (negative) and 1 (positive)
  const words = text.toLowerCase().split(/\s+/);

  const positiveWords = ['good', 'great', 'excellent', 'happy', 'satisfied', 'thanks', 'thank', 'please', 'appreciate'];
  const negativeWords = ['bad', 'terrible', 'awful', 'unhappy', 'dissatisfied', 'angry', 'upset', 'disappointed', 'problem', 'issue'];

  let score = 0;

  for (const word of words) {
    if (positiveWords.includes(word)) score += 0.2;
    if (negativeWords.includes(word)) score -= 0.2;
  }

  // Clamp between -1 and 1
  return Math.max(-1, Math.min(1, score));
}