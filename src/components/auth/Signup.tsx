import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../db-services/firebase';
import { Partner, Person } from '../../model/types';
import "./auth.css";
import { environment } from '../../config/environment';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // 1. Create Authentication user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Store credentials and UID temporarily for verification
      localStorage.setItem('emailForSignIn', email);
      localStorage.setItem('passwordForSignIn', password);
      localStorage.setItem('partnerUid', uid);

      // 2. Send verification email with correct configuration
      const actionCodeSettings = {
        // Use Firebase's standard verification URL format
        url: `${environment.appUrl}/verify-email?uid=${uid}`,
        handleCodeInApp: false
      };

      console.log('Verification URL:', actionCodeSettings.url);

      await sendEmailVerification(userCredential.user, actionCodeSettings);

      // 3. Create base personal information
      const personalInfo: Person = {
        firstName,
        lastName,
        email,
        phoneNumber,
        whatsappNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "Inactive" // Initial status before activation and approval
      };

      // 4. Create partner document with pending status
      const partnerData: Partner = {
        partnerId: uid,
        personalInformation: personalInfo,
        role: "Partner",
        hierarchyId: null,
        activationStatus: "Pending", // New field for tracking activation
        approvalStatus: "Pending",   // New field for tracking approval
        submittedAt: new Date()
      };

      // 5. Save to Firestore
      await setDoc(doc(firestore, 'partners', uid), partnerData);
      
      // 6. Show success message
      setSuccessMessage(
        "Registration submitted successfully! Please check your email to activate your account. " +
        "After activation, your account will need administrator approval."
      );

      // Clear form
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setWhatsappNumber("");

    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup stored credentials when component unmounts
      localStorage.removeItem('emailForSignIn');
      localStorage.removeItem('passwordForSignIn');
    };
  }, []);

  return (
    <div className="auth-container">
      <h2 className="auth-title">Partner Registration</h2>
      {error && <div className="auth-error">{error}</div>}
      {successMessage && <div className="auth-success">{successMessage}</div>}
      
      <form onSubmit={handleSignup} className="auth-form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="auth-input"
          required
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="auth-input"
          required
          disabled={loading}
        />

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
          minLength={6}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="auth-input"
          required
          disabled={loading}
        />

        <input
          type="tel"
          placeholder="WhatsApp Number"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          className="auth-input"
          required
          disabled={loading}
        />

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Submitting Registration..." : "Register as Partner"}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Login</Link>
      </div>
    </div>
  );
};

export default Signup;
