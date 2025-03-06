import type { Message } from "@prisma/client";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Form } from "react-router";
import { Label } from "../ui/label";

export default function MessageDetails({ message }: { message: Message }) {
  return (
    <div className="p-4 border rounded-md mb-4">
      <div className="font-medium mb-2">{message.isFromCustomer ? "Customer" : "Agent"}</div>
      <div className="text-gray-700">{message.content}</div>
      <div className="text-sm text-gray-500 mt-2">
        {new Date(message.createdAt).toLocaleString()}
      </div>
    </div>
  );
}

interface AddMessageFormProps {
  ticketId?: string; // Optional for new tickets
  className?: string;
  submitLabel?: string;
}

export function AddMessageForm({ ticketId, className = "", submitLabel = "Send" }: AddMessageFormProps) {
  // If ticketId is provided, this is a reply to an existing ticket
  const action = ticketId ? `/tickets/${ticketId}/reply` : "";

  return (
    <Form method="post" action={action} className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="content">Message</Label>
        <Input
          type="text"
          name="content"
          id="content"
          className="mt-1 block w-full"
          placeholder="Type your message here..."
          required
        />
      </div>
      <Button type="submit">{submitLabel}</Button>
    </Form>
  );
}