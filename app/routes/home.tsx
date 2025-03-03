import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This is the multilingual customer service portal.</p>
          <div className="flex gap-2">
            <Button>Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
