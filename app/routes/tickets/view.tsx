import type { Route } from "../+types/view";
import { getTicketById } from "~/services/ticket.server";
import type { Message } from "@prisma/client";
import { Link } from "react-router";
import { buttonVariants } from "~/components/ui/button";

export async function loader(args: Route.LoaderArgs) {
  const ticket = await getTicketById(args.params.id);
  return { ticket };
}

export default function Ticket({ params, loaderData }: Route.ComponentProps) {
  const ticket = loaderData.ticket;
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
      <div>{ticket?.assignee?.email}</div>

      Messages:
      <div>
        {ticket.messages.map((message: Message) => message.content)}
      </div>

      Edit:
      <Link className={`${buttonVariants({ variant: "outline" })} ml-4`} to={`/tickets/edit/${ticket.id}`}>Edit</Link>
    </div>
  );
}
