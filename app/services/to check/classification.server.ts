// In a real app, you would use an AI service API
// This is a simplified mock implementation
export async function classifyTicket(title: string, description: string): Promise<string> {
  const text = `${title} ${description}`.toLowerCase();

  // Simple keyword-based classification
  if (text.includes('billing') || text.includes('payment') || text.includes('invoice')) {
    return 'Billing';
  } else if (text.includes('login') || text.includes('password') || text.includes('account')) {
    return 'Account';
  } else if (text.includes('error') || text.includes('bug') || text.includes('not working')) {
    return 'Technical';
  } else if (text.includes('shipping') || text.includes('delivery') || text.includes('package')) {
    return 'Shipping';
  } else if (text.includes('return') || text.includes('refund') || text.includes('exchange')) {
    return 'Returns';
  } else {
    return 'General';
  }
}

export async function getPriorityFromSentiment(sentiment: number): Promise<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> {
  if (sentiment < -0.7) {
    return 'URGENT';
  } else if (sentiment < -0.3) {
    return 'HIGH';
  } else if (sentiment < 0.3) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}