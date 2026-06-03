const TOKEN_KEY = "token";
const USER_TYPE_KEY = "userType";
const USER_INFO_KEY = "userInfo";

export type AuthRole = "MEMBER" | "COACH" | "SYS_USER";

export type AuthSession = {
  token: string;
  userType: AuthRole;
  userInfo?: unknown;
};

export function readAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function readAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const token = window.localStorage.getItem(TOKEN_KEY);
  const userType = window.localStorage.getItem(USER_TYPE_KEY) as AuthRole | null;

  if (!token || (userType !== "MEMBER" && userType !== "COACH" && userType !== "SYS_USER")) {
    return null;
  }

  const rawUserInfo = window.localStorage.getItem(USER_INFO_KEY);
  let userInfo: unknown;
  if (rawUserInfo) {
    try {
      userInfo = JSON.parse(rawUserInfo);
    } catch {
      userInfo = undefined;
    }
  }

  return { token, userType, userInfo };
}

export function hasAuthToken() {
  return Boolean(readAuthToken());
}

export function hasMemberSession() {
  return readAuthSession()?.userType === "MEMBER";
}

export function saveAuthToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, session.token);
  window.localStorage.setItem(USER_TYPE_KEY, session.userType);
  if (session.userInfo !== undefined) {
    window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(session.userInfo));
  }
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_TYPE_KEY);
  window.localStorage.removeItem(USER_INFO_KEY);
}

export const clearAuthSession = clearAuthToken;
