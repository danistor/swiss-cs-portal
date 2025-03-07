import type { Message } from "@prisma/client";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Form, useFetcher } from "react-router";
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
  ticketId?: string;
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

export function EditMessage({ message, setEditMessage }:
  { message: Message, setEditMessage: (editMessage: boolean) => void }) {
  const fetcher = useFetcher();
  const saved = fetcher.formData ? fetcher.formData.get("content") : null;
  saved ? setEditMessage(false) : null;

  return (
    <fetcher.Form method="post" action={`/messages/${message.id}/edit`}>
      <input type="hidden" name="ticketId" value={message.ticketId} />
      <Input type="text" name="content" defaultValue={message.content} />
      <Button type="submit">Save</Button>
      <Button type="button" variant="destructive" onClick={() => {
        setEditMessage(false);
      }}>Cancel</Button>
    </fetcher.Form>
  );
}
