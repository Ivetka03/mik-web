/// <reference types="vite/client" />

declare module "*server/api.mjs" {
  import type { IncomingMessage, ServerResponse } from "node:http";
  export function handleAdminRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean>;
}
