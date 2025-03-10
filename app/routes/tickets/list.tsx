import { useSearchParams } from "react-router";
import { getTickets } from "../../services/ticket.server";
import { getCurrentUser } from "../../services/auth.server";
import type { Route } from "./+types/list";
import { Button } from "~/components/ui/button";
import { MyTicketsList } from "~/components/tickets/Ticket";
import { UserRole } from "@prisma/client";

export async function loader(args: Route.LoaderArgs) {
  const user = await getCurrentUser(args);
  const filters = user.role === "CUSTOMER" ? { creatorId: user.id } : {};
  const tickets = await getTickets(filters);

  return { tickets, user };
}

export default function TicketsList({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  const user = loaderData.user;
  const tickets = loaderData.tickets;
  const toggleText = filter ? "All tickets" : "My tickets";

  // Apply filter based on URL parameter
  const filteredTickets = filter
    ? tickets.filter(ticket => ticket.assigneeId === user.id)
    : tickets;

  const handleFilterClick = () => {
    // Toggle filter parameter in the URL
    if (filter) {
      searchParams.delete("filter");
    } else {
      searchParams.set("filter", "mine");
    }
    setSearchParams(searchParams);
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Tickets List</h1>
      {user.role !== UserRole.CUSTOMER && (
        <div className="flex flex-row items-center gap-2 my-6">
          <span>Show only my assigned tickets</span>
          <Button onClick={handleFilterClick}>{toggleText}</Button>
        </div>
      )}
      <MyTicketsList tickets={filteredTickets} />
    </>
  );
}