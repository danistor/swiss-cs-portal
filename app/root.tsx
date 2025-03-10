import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { rootAuthLoader } from '@clerk/react-router/ssr.server'
import { ClerkProvider, SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/react-router'
import type { Route } from "./+types/root";
import "./app.css";
import { getCurrentUser } from "~/services/auth.server";
import { Link } from "react-router";


// Get the publishable key from the environment
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader(args: Route.LoaderArgs) {
  // Only apply authentication check for protected routes
  // @todo doesn't work with Clerk
  const pathname = new URL(args.request.url).pathname;
  if (pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/about") {
    return rootAuthLoader(args);
  }

  try {
    const user = await getCurrentUser(args);
    return rootAuthLoader(args, ({ request, context, params }) => {
      context.user = user;
      return { user: user }
    });
  } catch (error) {
    // If there's a redirect response from getCurrentUser, pass it through
    if (error instanceof Response && error.status === 302) {
      return error;
    }
    throw error;
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: { loaderData: Route.ComponentProps }) {
  return (
    <ClerkProvider
      loaderData={loaderData}
      signUpFallbackRedirectUrl="/sign-up"
      signInFallbackRedirectUrl="/sign-in"
    >
      <main className="m-10">
        <SignedOut>
          <div className="flex gap-4 items-center">
            <SignInButton />
            <Link to="/sign-up" className="text-blue-600 hover:underline">Create an account</Link>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
          <Outlet />
        </SignedIn>
      </main>
    </ClerkProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
