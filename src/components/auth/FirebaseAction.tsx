import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, firestore } from '../../db-services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { applyActionCode, signInWithEmailAndPassword } from 'firebase/auth';
import "./auth.css";
import { environment } from '../../config/environment';

const FirebaseAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode');
        const oobCode = params.get('oobCode');

        console.log('Current environment:', environment); // Debug log

        if (!oobCode || mode !== 'verifyEmail') {
          throw new Error('Invalid verification link');
        }

        // 1. Apply the verification code
        await applyActionCode(auth, oobCode);

        // 2. Get email from localStorage
        const email = localStorage.getItem('emailForSignIn');
        const password = localStorage.getItem('passwordForSignIn');

        if (!email || !password) {
          throw new Error('Please sign in to complete verification');
        }

        // 3. Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // 4. Update Firestore
        const partnerRef = doc(firestore, 'partners', uid);
        await updateDoc(partnerRef, {
          activationStatus: 'Activated',
          activatedAt: new Date(),
          'personalInformation.status': 'Inactive'
        });

        // 5. Clear stored credentials
        localStorage.removeItem('emailForSignIn');
        localStorage.removeItem('passwordForSignIn');

        setStatus('success');
        setMessage('Email verified successfully! Your account is now activated and awaiting admin approval.');

        // 6. Redirect to login using environment-specific URL
        setTimeout(() => {
          window.location.href = `${environment.appUrl}/login`;
        }, 3000);

      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to verify email');
      }
    };

    handleVerification();
  }, []);

  return (
    <div className="auth-container">
      <h2 className="auth-title">Email Verification</h2>
      <div className={`auth-message ${status}`}>
        {status === 'loading' && (
          <div className="loading-spinner">
            <p>Verifying your email...</p>
          </div>
        )}
        {status === 'success' && (
          <>
            <p className="success-message">{message}</p>
            <p>Redirecting to login page...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="error-message">{message}</p>
            <button 
              className="auth-button"
              onClick={() => window.location.href = '/login'}
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FirebaseAction; 