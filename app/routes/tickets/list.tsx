
import { getTickets } from "../../services/ticket.server";
import type { Ticket } from "@prisma/client";
import { getCurrentUser } from "../../services/auth.server";
import type { Route } from "./+types/list";
import { Link } from "react-router";
import { buttonVariants } from "~/components/ui/button";


export async function loader(args: Route.LoaderArgs) {
  const user = await getCurrentUser(args);
  // console.log("user", user);

  const tickets = await getTickets({ creatorId: user.id });
  // console.log("tickets", tickets);
  return { tickets };
}

export default function TicketsList({ loaderData }: Route.ComponentProps) {
  const tickets = loaderData.tickets;

  return (
    <>
      <div>TicketsList***</div>

      {tickets.map((ticket: Ticket) => (
        <div className="text-blue-500" key={ticket.id}>
          {ticket.title}
          <Link className={`${buttonVariants({ variant: "outline" })} ml-4`} to={`/tickets/id/${ticket.id}`}>View</Link>
        </div>
      ))}
    </>
  );
}

