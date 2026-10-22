import type { IncomingMessage, ServerResponse } from "node:http";

declare module "./api.mjs" {
  export function handleAdminRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean>;
}

declare module "../server/api.mjs" {
  export function handleAdminRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean>;
}
