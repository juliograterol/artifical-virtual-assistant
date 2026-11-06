// Human-readable messages for Firebase Auth / Firestore error codes.

const MESSAGES: Record<string, string> = {
  // Auth
  "auth/invalid-credential": "Incorrect email or password. Try again.",
  "auth/wrong-password": "Incorrect email or password. Try again.",
  "auth/user-not-found": "Incorrect email or password. Try again.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/missing-password": "Enter your password.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
  "auth/too-many-requests":
    "Too many attempts. Wait a few minutes and try again.",
  "auth/network-request-failed":
    "Can't reach the server. Check your connection and try again.",
  "auth/operation-not-allowed":
    "Email/password sign-in isn't enabled for this app. Contact support.",

  // Firestore
  "permission-denied": "You don't have access to this.",
  unavailable: "Can't reach the server. Check your connection and try again.",
  "failed-precondition":
    "The database is still being set up. Try again in a few minutes.",
  "not-found": "This item no longer exists.",
  unauthenticated: "Your session expired. Log in again.",
};

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  const code = (err as { code?: string })?.code;
  return (code && MESSAGES[code]) || fallback;
}
