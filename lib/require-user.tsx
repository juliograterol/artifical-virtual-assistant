"use client";

import type { User } from "firebase/auth";
import Login from "@/components/forms/login";
import { auth } from "./firebase";
import { getSignedInUser } from "./auth-actions";
import { showAlert } from "./show-alert";

/**
 * Returns the signed-in user. If nobody is signed in (after Firebase has
 * restored the session), shows the login form and waits for it.
 * Resolves null if the user closes the login form.
 */
export async function requireUser(): Promise<User | null> {
  const user = await getSignedInUser();
  if (user) return user;

  return new Promise((resolve) => {
    showAlert({
      form: <Login onLogin={() => resolve(auth.currentUser)} />,
    }).then((loggedIn) => {
      if (!loggedIn) resolve(null);
    });
  });
}
