import { apiRequest } from "./api-client";

export type LoginMemberPayload = {
  phone: string;
  password: string;
};

export type LoginCoachPayload = LoginMemberPayload;

export type LoginAdminPayload = {
  username: string;
  password: string;
};

export type RegisterMemberPayload = {
  name: string;
  phone: string;
  password: string;
  gender: 0 | 1;
};

type TokenResponse = {
  token?: string;
};

async function loginWithToken(path: string, payload: unknown) {
  const data = await apiRequest<TokenResponse>(path, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!data?.token) {
    throw new Error("登录成功但没有收到 token，请检查后端登录响应。");
  }

  return data.token;
}

export function loginMember(payload: LoginMemberPayload) {
  return loginWithToken("/auth/member/login", payload);
}

export function loginCoach(payload: LoginCoachPayload) {
  return loginWithToken("/auth/coach/login", payload);
}

export function loginAdmin(payload: LoginAdminPayload) {
  return loginWithToken("/auth/admin/login", payload);
}

export function registerMember(payload: RegisterMemberPayload) {
  return apiRequest<void>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logout() {
  return apiRequest<void>("/auth/logout", {
    method: "POST"
  });
}
