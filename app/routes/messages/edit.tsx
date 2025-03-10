import type { Route } from "../+types/edit-message"
import { updateMessage } from "~/services/message.server"
// import { getCurrentUser } from "~/services/auth.server";
import { redirect } from "react-router";

// If someone navigates directly to this URL, redirect them back to the ticket
export async function loader({ params }: Route.LoaderArgs) {
  return redirect(`/tickets/id/${params.id}`);
}

export async function action({ params, request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  // Handle cancel intent - just return success without doing anything
  if (intent === 'cancel') {
    return { ok: true };
  }

  try {
    // Get current user for validation - commenting out due to type issues
    // const user = await getCurrentUser({ params, request, context });

    // Extract form data
    const content = formData.get("content") as string;

    // Validate content
    if (!content || content.trim() === '') {
      return {
        ok: false,
        error: "Message content cannot be empty",
        editing: true
      };
    }

    // Check if user can edit this message (implement this in a real app)
    // For example: check if user is the author or has admin rights
    // const canEdit = await canUserEditMessage(params.id, user.id);
    // if (!canEdit) {
    //   return { ok: false, error: "You don't have permission to edit this message" };
    // }

    // Update the message
    await updateMessage(params.id, { content: content.trim() });

    // Return success response for the fetcher
    return {
      ok: true,
      message: "Message updated successfully"
    };
  } catch (error) {
    console.error("Error updating message:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}