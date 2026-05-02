import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  RecaptchaVerifier,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

import { auth, db } from "./config";

// ── TYPES ────────────────────────────────────────────────────────────────
export type Role = "admin" | "support" | "pharmacist";

// ── REGISTER ─────────────────────────────────────────────────────────────
// Creates a new user + stores role in Firestore
export const registerUser = async (
  email: string,
  password: string,
  role: Role = "pharmacist"
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // Save role in Firestore
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role: role,
    createdAt: new Date(),
  });

  // Send verification email
  await sendEmailVerification(user);

  return user;
};

// ── LOGIN ────────────────────────────────────────────────────────────────
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

// ── GET USER ROLE ────────────────────────────────────────────────────────
export const getUserRole = async (uid: string): Promise<Role> => {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data().role as Role;
  }

  // fallback (important to avoid crash)
  return "pharmacist";
};

// ── LOGOUT ───────────────────────────────────────────────────────────────
export const logoutUser = async () => {
  await signOut(auth);
};

// ── PHONE 2FA SETUP ──────────────────────────────────────────────────────
export const setupRecaptcha = (buttonId: string) => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
    size: "invisible",
  });
  return recaptchaVerifier;
};
