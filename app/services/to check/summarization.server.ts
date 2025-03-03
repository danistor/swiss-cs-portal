import { getResponsesByTicketId } from './response.server';

// In a real app, you would use an AI service API
// This is a simplified mock implementation
export async function summarizeConversation(ticketId: string): Promise<string> {
  const responses = await getResponsesByTicketId(ticketId);

  if (responses.length === 0) {
    return "No conversation to summarize.";
  }

  // Count the number of customer and agent messages
  const customerMessages = responses.filter(r => !r.isFromAgent).length;
  const agentMessages = responses.filter(r => r.isFromAgent).length;

  // Get the latest response
  const latestResponse = responses[responses.length - 1];
  const latestSender = latestResponse.isFromAgent ? "an agent" : "the customer";

  // Very simple summary
  return `This conversation contains ${responses.length} messages (${customerMessages} from the customer, ${agentMessages} from agents). The most recent message was from ${latestSender} on ${latestResponse.createdAt.toLocaleString()}.`;
}