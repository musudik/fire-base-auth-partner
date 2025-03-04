import { auth, firestore } from "@/db-services/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// 🔹 Register User (Client or Partner)
export const registerUser = async (email, password, name, role, parentId = null) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user info in Firestore
    await setDoc(doc(firestore, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      role, // "partner" or "client"
      parentId: parentId, // If client, assign partner ID
      hierarchyPath: parentId ? [parentId] : [],
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Registration Error:", error.message);
    throw error;
  }
};

// 🔹 Login User
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// 🔹 Logout User
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

// 🔹 Get User Details
export const getUserDetails = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, "users", userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error getting user details:", error.message);
    return null;
  }
};
