import { SignUp } from "@clerk/react-router";
import type { Route } from "../+types/sign-up";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sign Up - Customer Support Portal" },
    { name: "description", content: "Create an account for the Customer Support Portal" },
  ];
}

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
        <SignUp routing="path" path="/sign-up" />
      </div>
    </div>
  );
} 