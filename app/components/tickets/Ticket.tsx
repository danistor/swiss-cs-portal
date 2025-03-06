import type { Ticket } from "@prisma/client";

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
