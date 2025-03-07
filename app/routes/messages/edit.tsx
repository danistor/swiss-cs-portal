import type { Route } from "../+types/edit-message"
import { updateMessage } from "~/services/message.server"
import { redirect } from "react-router";

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const { content, ticketId } = Object.fromEntries(formData) as { content: string, ticketId: string };
  await updateMessage(params.id, { content: content });

  return redirect(`/tickets/id/${ticketId}`);
}