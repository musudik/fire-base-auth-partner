import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../db-services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import "./auth.css";

const PartnerActivation = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      try {
        // Get the action code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const oobCode = urlParams.get('oobCode');
        const mode = urlParams.get('mode');

        if (!oobCode || mode !== 'verifyEmail') {
          throw new Error('Invalid activation link');
        }

        // First verify the action code
        await checkActionCode(auth, oobCode);
        
        // Apply the action code to verify the email
        await applyActionCode(auth, oobCode);

        // Get the current user
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No user found');
        }

        // Update the partner document
        const partnerRef = doc(firestore, 'partners', user.uid);
        const partnerDoc = await getDoc(partnerRef);

        if (!partnerDoc.exists()) {
          throw new Error('Partner document not found');
        }

        // Update activation status
        await updateDoc(partnerRef, {
          activationStatus: 'Activated',
          activatedAt: new Date(),
          'personalInformation.status': 'Inactive' // Still inactive until approved
        });

        setStatus('success');
        setMessage(
          'Email verified and account activated successfully! ' +
          'Please wait for administrator approval. ' +
          'You will be redirected to the login page.'
        );

        // Redirect to login after 5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 5000);

      } catch (error: any) {
        console.error('Activation error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to activate account');
      }
    };

    activateAccount();
  }, [navigate]);

  return (
    <div className="auth-container">
      <h2 className="auth-title">Account Activation</h2>
      <div className={`auth-message ${status}`}>
        {status === 'loading' && (
          <div className="loading-spinner">
            <p>Activating your account...</p>
          </div>
        )}
        {(status === 'success' || status === 'error') && (
          <>
            <p>{message}</p>
            {status === 'error' && (
              <button 
                className="auth-button"
                onClick={() => navigate('/login')}
              >
                Return to Login
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PartnerActivation; 