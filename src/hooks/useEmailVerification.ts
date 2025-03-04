import { useState, useEffect } from 'react';
import { auth, firestore } from '../db-services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { applyActionCode } from 'firebase/auth';

interface VerificationStatus {
  status: 'loading' | 'success' | 'error';
  message: string;
}

export const useEmailVerification = (oobCode: string | null): VerificationStatus => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!oobCode) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        // 1. Apply the action code to verify the email
        await applyActionCode(auth, oobCode);

        // 2. Get the current user
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No user found');
        }

        // 3. Get the partner document
        const partnerRef = doc(firestore, 'partners', user.uid);
        const partnerDoc = await getDoc(partnerRef);

        if (!partnerDoc.exists()) {
          throw new Error('Partner document not found');
        }

        // 4. Update the activation status
        await updateDoc(partnerRef, {
          activationStatus: 'Activated',
          activatedAt: new Date(),
          'personalInformation.status': 'Inactive' // Still inactive until approved
        });

        setStatus('success');
        setMessage('Email verified and account activated successfully!');

      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to verify email');
      }
    };

    verifyEmail();
  }, [oobCode]);

  return { status, message };
}; 