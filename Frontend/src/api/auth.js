import { apiFetch } from "./config";
import { AUTH_API_URL } from "./config";

export async function getMe() {
  return apiFetch(AUTH_API_URL, "me");
}

export async function checkEmailExists(email) {
  return apiFetch(AUTH_API_URL, "verifyemail", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function signUp(userInformation) {
  console.log("Signup payload:", userInformation);
  return apiFetch(AUTH_API_URL, "signup", {
    method: "POST",
    body: JSON.stringify(userInformation),
  });
}

export async function signIn(email, password) {
  return apiFetch(AUTH_API_URL, "signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signOut() {
  return apiFetch(AUTH_API_URL, "signout", {
    method: "POST",
  });
}
