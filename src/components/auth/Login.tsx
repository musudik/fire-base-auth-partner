import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./auth.css";
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../db-services/firebase';
import { FirebaseError } from 'firebase/app';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await login(email, password);
      const uid = userCredential.user.uid;

      // First try partner collection
      const partnerDoc = await getDoc(doc(firestore, 'partners', uid));
      if (partnerDoc.exists()) {
        const partnerData = partnerDoc.data();
        if (partnerData.role === "Partner") {
          // Check activation and approval status
          if (partnerData.activationStatus === "Pending") {
            setError("Please activate your account through the email link first.");
            return;
          }
          if (partnerData.approvalStatus === "Pending") {
            setError("Your account is awaiting administrator approval.");
            return;
          }
          if (partnerData.activationStatus === "Rejected" || partnerData.approvalStatus === "Rejected") {
            setError("Your account has been rejected. Please contact administrator.");
            return;
          }
          
          // If all checks pass, allow login
          navigate("/partner-dashboard");
          return;
        }
      }

      // Then try client collection
      const clientDoc = await getDoc(doc(firestore, 'clients', uid));
      if (clientDoc.exists()) {
        const clientData = clientDoc.data();
        if (clientData.role === "Client") {
          navigate("/client-dashboard");
          return;
        }
      }

      // If we get here, no valid role was found
      setError("Account exists but no role assigned. Please contact administrator.");
      
    } catch (error: any) {
      console.error("Login error:", error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            setError("No account found with this email.");
            break;
          case 'auth/wrong-password':
            setError("Incorrect password.");
            break;
          case 'auth/too-many-requests':
            setError("Too many failed attempts. Please try again later.");
            break;
          default:
            setError("Failed to login. Please try again.");
        }
      } else {
        setError(error.message || "Failed to login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          required
          disabled={loading}
        />
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="auth-footer">
        Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
