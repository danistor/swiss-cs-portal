import type { Route } from "../+types/new-ticket";
import { redirect, useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { createTicket } from "~/services/ticket.server";
import { getCurrentUser } from "~/services/auth.server";
import { createMessage } from "~/services/message.server";
import { cn } from "~/lib/utils";

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_MESSAGE_LENGTH = 1000;

export async function action(args: Route.ActionArgs) {
  const user = await getCurrentUser(args);
  const { title, description, message } = Object.fromEntries(await args.request.formData()) as {
    title: string;
    description: string;
    message: string;
  };

  const errors: Record<string, string> = {};

  if (!title?.trim()) {
    errors.title = "Title is required";
  } else if (title.length < 3) {
    errors.title = "Title must be at least 3 characters long";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `Title must be at most ${MAX_TITLE_LENGTH} characters long`;
  }

  if (!description?.trim()) {
    errors.description = "Description is required";
  } else if (description.length < 10) {
    errors.description = "Description must be at least 10 characters long";
  } else if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters long`;
  }

  if (!message?.trim()) {
    errors.message = "Initial message is required";
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be at most ${MAX_MESSAGE_LENGTH} characters long`;
  }

  if (Object.keys(errors).length > 0) {
    return new Response(JSON.stringify({
      errors,
      values: { title, description, message }
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const ticket = await createTicket({ title: title.trim(), description: description.trim(), creatorId: user.id });
  await createMessage({
    content: message.trim(),
    isFromCustomer: true,
    ticketId: ticket.id,
    userId: user.id
  });

  return redirect(`/tickets/id/${ticket.id}`);
}

export default function NewTicket() {
  const fetcher = useFetcher();
  const { errors, values } = (fetcher.data as {
    errors?: Record<string, string>;
    values?: { title: string; description: string; message: string };
  }) || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Get the corresponding counter element
    let counterId = "";
    let maxLength = 0;

    if (name === "title") {
      counterId = "title-counter";
      maxLength = MAX_TITLE_LENGTH;
    } else if (name === "description") {
      counterId = "description-counter";
      maxLength = MAX_DESCRIPTION_LENGTH;
    } else if (name === "message") {
      counterId = "message-counter";
      maxLength = MAX_MESSAGE_LENGTH;
    }

    // Update the counter if found
    const counterElement = document.getElementById(counterId);
    if (counterElement) {
      const count = value.length;
      const isNearLimit = count > maxLength * 0.9;
      const isOverLimit = count > maxLength;

      counterElement.textContent = `${count}/${maxLength}`;
      counterElement.className = cn(
        "text-xs text-right mt-1",
        isOverLimit ? "text-destructive" : isNearLimit ? "text-yellow-500" : "text-muted-foreground"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Ticket</h1>
      <fetcher.Form method="post" className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            maxLength={MAX_TITLE_LENGTH}
            defaultValue={values?.title}
            onChange={handleChange}
            className={cn(
              "mt-1 block w-full",
              errors?.title ? "border-destructive" : ""
            )}
            aria-invalid={errors?.title ? true : undefined}
            placeholder="Brief summary of your issue"
          />
          <div
            id="title-counter"
            className="text-xs text-right mt-1 text-muted-foreground"
          >
            {(values?.title?.length || 0)}/{MAX_TITLE_LENGTH}
          </div>
          {errors?.title && (
            <div className="text-destructive text-sm mt-1">{errors.title}</div>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            name="description"
            id="description"
            maxLength={MAX_DESCRIPTION_LENGTH}
            defaultValue={values?.description}
            onChange={handleChange}
            className={cn(
              "mt-1 block w-full min-h-[100px]",
              errors?.description ? "border-destructive" : ""
            )}
            aria-invalid={errors?.description ? true : undefined}
            placeholder="Detailed description of your issue"
          />
          <div
            id="description-counter"
            className="text-xs text-right mt-1 text-muted-foreground"
          >
            {(values?.description?.length || 0)}/{MAX_DESCRIPTION_LENGTH}
          </div>
          {errors?.description && (
            <div className="text-destructive text-sm mt-1">{errors.description}</div>
          )}
        </div>

        <div>
          <Label htmlFor="message">Initial Message</Label>
          <Textarea
            name="message"
            id="message"
            maxLength={MAX_MESSAGE_LENGTH}
            defaultValue={values?.message}
            onChange={handleChange}
            className={cn(
              "mt-1 block w-full min-h-[100px]",
              errors?.message ? "border-destructive" : ""
            )}
            aria-invalid={errors?.message ? true : undefined}
            placeholder="Your first message to customer service"
          />
          <div
            id="message-counter"
            className="text-xs text-right mt-1 text-muted-foreground"
          >
            {(values?.message?.length || 0)}/{MAX_MESSAGE_LENGTH}
          </div>
          {errors?.message && (
            <div className="text-destructive text-sm mt-1">{errors.message}</div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={fetcher.state === "submitting"}
          >
            {fetcher.state === "submitting" ? "Creating..." : "Create Ticket"}
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
}
