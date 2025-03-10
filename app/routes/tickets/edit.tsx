import type { Route } from "../+types/edit-ticket";
import { getTicketById, updateTicket } from "~/services/ticket.server";
import { useNavigate, redirect } from "react-router";
import { TicketForm } from "~/components/tickets/Ticket";

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
  const navigate = useNavigate();

  return (
    <div>
      <TicketForm ticket={ticket} cancelAction={() => navigate(-1)} />
    </div>
  );
}
