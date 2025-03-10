import type { Ticket } from "@prisma/client";
import { Link } from "react-router";
import { buttonVariants } from "../ui/button";
export default function TicketDetails({ ticket }: { ticket: Ticket }) {
  return (
    <div>
      <h1>{ticket.title}</h1>
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
    </div>
  );
}

export function MyTicketsList({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="flex flex-col gap-4">
      {tickets.map((ticket: Ticket) => (
        <div key={ticket.id} className="flex flex-row items-center">
          <div className="text-blue-500">{ticket.title}</div>
          <Link className={`${buttonVariants({ variant: "outline" })} ml-4`} to={`/tickets/id/${ticket.id}`}>View</Link>
        </div>
      ))}
    </div>
  );
}
