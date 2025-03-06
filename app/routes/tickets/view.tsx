import type { Route } from "../+types/view";
import { getTicketById } from "~/services/ticket.server";
import type { Message } from "@prisma/client";
import { Link } from "react-router";
import { buttonVariants } from "~/components/ui/button";
import TicketDetails from "~/components/tickets/Ticket";
import MessageDetails, { AddMessageForm } from "~/components/tickets/Message";

export async function loader(args: Route.LoaderArgs) {
  const ticket = await getTicketById(args.params.id);
  return { ticket };
}

export default function Ticket({ params, loaderData }: Route.ComponentProps) {
  const ticket = loaderData.ticket;
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ticket: {ticket.title}</h1>
        <Link
          className={buttonVariants({ variant: "outline" })}
          to={`/tickets/edit/${ticket.id}`}
        >
          Edit Ticket
        </Link>
      </header>

      <TicketDetails ticket={ticket} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <div className="space-y-4">
          {ticket.messages.map((message: Message) => (
            <MessageDetails key={message.id} message={message} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Reply</h2>
        <AddMessageForm
          ticketId={ticket.id}
          className="max-w-2xl"
          submitLabel="Send Reply"
        />
      </section>
    </div>
  );
}
