import type { Route } from "../+types/new-ticket";
import { Form, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createTicket } from "~/services/ticket.server";
import { getCurrentUser } from "~/services/auth.server";
import { createMessage } from "~/services/message.server";

export async function action(args: Route.ActionArgs) {
  const user = await getCurrentUser(args);
  const { title, description, message } = Object.fromEntries(await args.request.formData()) as {
    title: string;
    description: string;
    message: string;
  };

  const ticket = await createTicket({ title, description, creatorId: user.id });
  await createMessage({
    content: message,
    isFromCustomer: true,
    ticketId: ticket.id,
    userId: user.id
  });

  return redirect(`/tickets/id/${ticket.id}`);
}

export default function NewTicket() {
  return (
    <div>
      <Form method="post">
        <Label htmlFor="title">Title</Label>
        <Input type="text" name="title" id="title" className="mt-1 block w-full" />
        <Label htmlFor="description">Description</Label>
        <Input type="text" name="description" id="description" className="mt-1 block w-full" />
        <Label htmlFor="message">Initial Message</Label>
        <Input type="text" name="message" id="message" className="mt-1 block w-full" />
        <Button type="submit">Create</Button>
      </Form>
    </div>
  );
}
