import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth, firestore } from '../../db-services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import "./auth.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const updateActivationStatus = async () => {
      try {
        // Get UID from URL params or localStorage
        const uid = searchParams.get('uid') || localStorage.getItem('partnerUid');
        
        if (!uid) {
          throw new Error('User information not found');
        }

        // Check if the user's email is verified
        await auth.currentUser?.reload();
        const user = auth.currentUser;

        if (!user || !user.emailVerified) {
          throw new Error('Email not verified');
        }

        // Update the partner's activation status
        const partnerRef = doc(firestore, 'partners', uid);
        await updateDoc(partnerRef, {
          activationStatus: 'Activated',
          activatedAt: new Date(),
          'personalInformation.status': 'Inactive' // Still inactive until approved
        });

        // Clear stored data
        localStorage.removeItem('emailForSignIn');
        localStorage.removeItem('passwordForSignIn');
        localStorage.removeItem('partnerUid');

        setStatus('success');
        setMessage('Email verified successfully! Your account is now activated and awaiting admin approval.');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);

      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(
          error.message === 'Email not verified' 
            ? 'Please verify your email by clicking the link in the verification email.'
            : 'Failed to complete verification'
        );
      }
    };

    updateActivationStatus();
  }, [navigate, searchParams]);

  return (
    <div className="auth-container">
      <h2 className="auth-title">Email Verification</h2>
      <div className={`auth-message ${status}`}>
        {status === 'loading' && (
          <div className="loading-spinner">
            <p>Completing verification...</p>
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
            <div className="error-actions">
              <button 
                className="auth-button"
                onClick={() => navigate('/login')}
              >
                Return to Login
              </button>
              <button 
                className="auth-button secondary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;