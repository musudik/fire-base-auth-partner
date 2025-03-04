import { useState, useEffect } from "react";
import { auth } from "@/db-services/firebase";
import { onAuthStateChanged } from "firebase/auth";

/**
 * Custom hook to get the authenticated user
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return { user };
};
