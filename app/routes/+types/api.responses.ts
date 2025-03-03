import type { LoaderArgs, ActionArgs } from "react-router";

export namespace Route {
  export interface LoaderArgs {
    request: Request;
    params: Record<string, string>;
  }

  export interface ActionArgs {
    request: Request;
    params: Record<string, string>;
  }
} 