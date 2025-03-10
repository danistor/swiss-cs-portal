import type { Message } from "@prisma/client";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Form, useFetcher } from "react-router";
import { Label } from "../ui/label";

export default function MessageDetails({ message }: { message: Message }) {
  const fetcher = useFetcher();
  const isEditingMessage = fetcher.data?.editing;

  // If in edit mode, show the edit form
  if (isEditingMessage) {
    return (
      <div className="p-4 border rounded-md mb-4">
        <div className="font-medium mb-2">{message.isFromCustomer ? "Customer" : "Agent"}</div>
        <fetcher.Form method="post" action={`/messages/${message.id}/edit`}>
          <input type="hidden" name="ticketId" value={message.ticketId} />
          <Input
            type="text"
            name="content"
            defaultValue={message.content}
            className="mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={fetcher.state === "submitting"}
            >
              {fetcher.state === "submitting" ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                // Reset the form by submitting a cancel intent
                fetcher.submit(
                  { intent: 'cancel', messageId: message.id },
                  { method: 'post', action: `/messages/${message.id}/edit` }
                );
              }}
            >
              Cancel
            </Button>
          </div>
          {fetcher.data?.error && (
            <div className="text-red-500 text-sm mt-2">{fetcher.data.error}</div>
          )}
        </fetcher.Form>
        <div className="text-sm text-gray-500 mt-2">
          {new Date(message.createdAt).toLocaleString()}
        </div>
      </div>
    );
  }

  // Otherwise, show the message content with an edit button
  return (
    <div className="p-4 border rounded-md mb-4">
      <div className="font-medium mb-2">{message.isFromCustomer ? "Customer" : "Agent"}</div>
      <div className="text-gray-700">{message.content}</div>
      <div className="flex justify-between items-center mt-2">
        <div className="text-sm text-gray-500">
          {new Date(message.createdAt).toLocaleString()}
        </div>
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="editMessage" />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
          >
            Edit
          </Button>
        </fetcher.Form>
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


