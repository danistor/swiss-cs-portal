import type { Route } from "../+types/view";
import { getTicketById } from "~/services/ticket.server";
import type { Message } from "@prisma/client";
import { Link } from "react-router";
import { Button, buttonVariants } from "~/components/ui/button";
import TicketDetails from "~/components/tickets/Ticket";
import MessageDetails, { AddMessageForm, EditMessage } from "~/components/tickets/Message";
import { useState } from "react";
export async function loader(args: Route.LoaderArgs) {
  const ticket = await getTicketById(args.params.id);
  return { ticket };
}

export default function Ticket({ loaderData }: Route.ComponentProps) {
  const ticket = loaderData.ticket;
  const [editMessage, setEditMessage] = useState<Message | boolean>(false);
  const [editMessageId, setEditMessageId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ticket: {ticket.title}</h1>
        <Link
          className={buttonVariants({ variant: "outline" })}
          to={`/tickets/edit/${ticket.id}`}
          viewTransition
        >
          Edit Ticket
        </Link>
      </header>

      <TicketDetails ticket={ticket} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <div className="space-y-4">
          {ticket.messages.map((message: Message) => (
            <li className="flex flex-col gap-2" key={message.id}>
              {editMessage && editMessageId === message.id ?
                <EditMessage key={message.id} message={message} setEditMessage={setEditMessage} /> :
                <div className="flex flex-col gap-2">
                  <MessageDetails key={message.id} message={message} />
                  <Button variant="outline" onClick={() => {
                    setEditMessage(true);
                    setEditMessageId(message.id);
                  }}>Edit</Button>
                </div>
              }
            </li>
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
