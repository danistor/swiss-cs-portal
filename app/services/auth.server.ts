import { redirect } from "react-router";
import { createClerkClient } from "@clerk/react-router/api.server";
import { getAuth } from "@clerk/react-router/ssr.server";
import { prisma } from "~/lib/db.server";
import type { User, UserRole, Language } from "@prisma/client";
import type { Route } from "../+types/root";

const clerkClient = createClerkClient({
  secretKey: import.meta.env.VITE_CLERK_SECRET_KEY,
});

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function getCurrentUser(args: Route.LoaderArgs | Route.ActionArgs): Promise<User> {
  try {
    const { userId } = await getAuth(args);

    // @todo: remove this once we have a proper auth flow
    if (!userId) {
      throw redirect("/sign-in");
    }

    // Get user from our database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // If user doesn't exist in our DB yet, create them
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);

      if (!clerkUser.emailAddresses?.[0]?.emailAddress) {
        throw new AuthError("User email not found");
      }

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          firstName: clerkUser.firstName ?? null,
          lastName: clerkUser.lastName ?? null,
          role: "CUSTOMER" as UserRole,
          preferredLanguage: "EN" as Language,
        },
      });
    }

    return user;
  } catch (error) {
    if (error instanceof Response) throw error; // For redirect responses
    console.error("Auth error:", error);
    throw redirect("/error");
  }
}

export async function requireAdmin(request: Request): Promise<User> {
  const user = await getCurrentUser(request);

  if (user.role !== "ADMIN") {
    throw redirect("/unauthorized");
  }

  return user;
}

export async function requireRepresentative(request: Request): Promise<User> {
  const user = await getCurrentUser(request);

  if (user.role !== "REPRESENTATIVE" && user.role !== "ADMIN") {
    throw redirect("/unauthorized");
  }

  return user;
}

// Helper to check if user has specific role
export function hasRole(user: User, ...roles: UserRole[]): boolean {
  return roles.includes(user.role);
}

/**
 * Require authentication and specific roles to access a route
 * @param request The request object or loader args
 * @param allowedRoles Array of roles that are allowed to access the route
 * @returns The authenticated user
 * @throws Redirects to login if not authenticated or forbidden if not authorized
 */
export async function requireAuth(
  args: Route.LoaderArgs | Route.ActionArgs,
  allowedRoles: UserRole[] = []
) {
  // Extract request from args if needed
  // const request = 'request' in requestOrArgs ? requestOrArgs.request : requestOrArgs;

  const { userId } = await getAuth(args);

  if (!userId) {
    throw redirect('/login');
  }

  // If no roles specified, just require authentication
  if (allowedRoles.length === 0) {
    return userId;
  }

  // Check if user has required role
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || !allowedRoles.includes(user.role)) {
    throw new Response('Forbidden', { status: 403 });
  }

  return userId;
}