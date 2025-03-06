import { redirect } from "react-router";
import { getCurrentUser } from "~/services/auth.server";
import { createMessage } from "~/services/message.server";
import type { Route } from "../+types/reply";

// @todo redirect if GET request

export async function action(args: Route.ActionArgs) {
  const user = await getCurrentUser(args);
  const formData = await args.request.formData();
  const content = formData.get("content") as string;

  await createMessage({
    content,
    isFromCustomer: user.role === "CUSTOMER",
    ticketId: args.params.id,
    userId: user.id
  });

  return redirect(`/tickets/id/${args.params.id}`);
} 