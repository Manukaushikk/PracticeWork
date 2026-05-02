import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { useAppDispatch } from "./app/hooks";
import { setUser, clearAuth, setLoading } from "./features/auth/authSlice";
import { getUserRole } from "./firebase/authHelpers";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      dispatch(setLoading(true)); // 👈 start loading

      if (firebaseUser) {
        try {
          // 👇 fetch role safely
          const role = await getUserRole(firebaseUser.uid);

          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              emailVerified: firebaseUser.emailVerified,
              role: role || "pharmacist", // 👈 fallback role
            })
          );
        } catch (error) {
          console.error("Role fetch failed:", error);

          // fallback user (no role)
          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              emailVerified: firebaseUser.emailVerified,
              role: "pharmacist",
            })
          );
        }
      } else {
        dispatch(clearAuth());
      }

      dispatch(setLoading(false)); // 👈 stop loading
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <AppRouter />;
};

export default App;