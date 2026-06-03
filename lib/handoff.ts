import type { AuthRole } from "./auth-store";

type HandoffRole = Extract<AuthRole, "COACH" | "SYS_USER">;

export type HandoffPayload = {
  token: string;
  userType: HandoffRole;
  redirect: string;
  issuedAt: number;
};

const DEFAULT_ADMIN_APP_URL = "http://localhost:3000";

function base64UrlEncode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function buildWorkbenchHandoffUrl(payload: Omit<HandoffPayload, "issuedAt">) {
  const baseUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL ?? DEFAULT_ADMIN_APP_URL;
  const handoff: HandoffPayload = {
    ...payload,
    issuedAt: Date.now()
  };
  const encoded = base64UrlEncode(JSON.stringify(handoff));
  return `${baseUrl.replace(/\/$/, "")}/login#handoff=${encoded}`;
}
