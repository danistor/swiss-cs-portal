import { SignIn } from "@clerk/react-router";
import type { Route } from "../+types/sign-in";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sign In - Customer Support Portal" },
    { name: "description", content: "Sign in to access the Customer Support Portal" },
  ];
}

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <SignIn routing="path" path="/sign-in" />
      </div>
    </div>
  );
} 