import { type RouteConfig, index, route, prefix, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/main.tsx", [
    index("routes/dashboard.tsx"),
    ...prefix("tickets", [
      route("list", "routes/tickets/list.tsx"),
      route("id/:id", "routes/tickets/view.tsx"), // @todo remove id from url and refactor where it is used
      route("new", "routes/tickets/new.tsx"),
      route("edit/:id", "routes/tickets/edit.tsx"),
      route(":id/reply", "routes/tickets/reply.tsx"),
    ]),
    route("messages/:id/edit", "routes/messages/edit.tsx"),
  ]),
  route("about", "routes/about.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
] satisfies RouteConfig;
