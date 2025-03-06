import type { Route } from "../+types/edit-ticket";
import { getTicketById, updateTicket } from "~/services/ticket.server";
import { Form, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export async function loader(args: Route.LoaderArgs) {
  const ticket = await getTicketById(args.params.id);
  if (!ticket) {
    throw new Response("Not Found", { status: 404 });
  }

  return { ticket };
}

export async function action({
  params,
  request,
}: Route.ActionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateTicket(params.id, updates);

  return redirect(`/tickets/id/${params.id}`);
}

export default function EditTicket({ params, loaderData }: Route.ComponentProps) {
  const ticket = loaderData.ticket;
  return (
    <div>
      <Form method="post" key={ticket.id} className="flex flex-col gap-4">
        <Input type="text" name="title" defaultValue={ticket.title} />
        <Input type="text" name="description" defaultValue={ticket.description} />
        <Input type="text" name="status" defaultValue={ticket.status} />
        <Input type="text" name="priority" defaultValue={ticket.priority} />
        <Button type="submit">Save</Button>
        <Button type="button" variant="destructive">Cancel</Button>
      </Form>
    </div>
  );
}
