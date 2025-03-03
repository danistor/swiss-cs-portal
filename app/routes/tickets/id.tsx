import type { Route } from "../+types/tickets";

export default function Ticket({ params }: Route.ComponentProps) {
  return <div>Ticket {params.id}</div>;
}
