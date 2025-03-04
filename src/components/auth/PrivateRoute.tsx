import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../db-services/firebase';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'partner' | 'client';
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { currentUser } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!currentUser) {
        setIsAuthorized(false);
        return;
      }

      try {
        if (requiredRole === 'partner') {
          const partnerDoc = await getDoc(doc(firestore, 'partners', currentUser.uid));
          setIsAuthorized(partnerDoc.exists());
        } else if (requiredRole === 'client') {
          const clientDoc = await getDoc(doc(firestore, 'clients', currentUser.uid));
          setIsAuthorized(clientDoc.exists());
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setIsAuthorized(false);
      }
    };

    checkUserRole();
  }, [currentUser, requiredRole]);

  if (isAuthorized === null) {
    // Loading state
    return <div>Loading...</div>;
  }

  if (!currentUser || !isAuthorized) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 