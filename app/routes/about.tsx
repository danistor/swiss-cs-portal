import type { Route } from "./+types/about";

// Route loaders provide data to route components before they are rendered. 
// They are only called on the server when server rendering or during the build with pre-rendering.
export async function loader() {
  return { message: "Hello, world!" };
}

// This is a component function. It is used to render the route.
// only client code can be used here
export default function About({
  loaderData,
  actionData,
  params,
  matches,
}: Route.ComponentProps) {
  return (
    <div>
      <h1>Welcome to My Route with Props!</h1>
      <p>Loader Data: {JSON.stringify(loaderData)}</p>
      <p>Action Data: {JSON.stringify(actionData)}</p>
      <p>Route Parameters: {JSON.stringify(params)}</p>
      <p>Matched Routes: {JSON.stringify(matches)}</p>
      <p>Message: {loaderData.message}</p>
    </div>
  );
}