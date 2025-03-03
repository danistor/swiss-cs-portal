
import { getTickets } from "../../services/ticket.server";
import type { Ticket } from "@prisma/client";
// import { getCurrentUser } from "../../services/auth.server";
import { getAuth } from '@clerk/react-router/ssr.server'
import type { Route } from "./+types/list";


export async function loader({ args }: Route.LoaderArgs) {
  // const user = await getCurrentUser(args);

  const { userId } = await getAuth(args)

  const tickets = await getTickets({ createdById: userId });
  return { tickets };
}

export default function TicketsList({ loaderData }: Route.ComponentProps) {
  const tickets = loaderData.tickets;

  return (
    <>
      <div>TicketsList***</div>

      {tickets.map((ticket: Ticket) => (
        <div className="text-blue-500" key={ticket.id}>{ticket.title}</div>
      ))}
    </>
  );
}

