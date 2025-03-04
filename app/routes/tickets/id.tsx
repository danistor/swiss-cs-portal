import type { Route } from "../+types/tickets";
import { getTicketById } from "~/services/ticket.server";

export async function loader(args: Route.LoaderArgs) {
  const ticket = await getTicketById(args.params.id);
  return { ticket };
}

export default function Ticket({ params, loaderData }: Route.ComponentProps) {
  const ticket = loaderData.ticket;
  console.log("ticket", ticket);
  return (
    <div>
      Ticket with param {params.id}
      <div>{ticket.title}</div>
      <div>{ticket.description}</div>
      <div>{ticket.status}</div>
      <div>{ticket.priority}</div>
      <div>{new Date(ticket.createdAt).toLocaleString()}</div>
      <div>{new Date(ticket.updatedAt).toLocaleString()}</div>
      <div>{ticket.creator.firstName}</div>
      <div>{ticket.creator.lastName}</div>
      <div>{ticket.creator.email}</div>
      <div>{ticket?.assignee?.firstName}</div>
      <div>{ticket?.assignee?.lastName}</div>
    </div>
  );
}
