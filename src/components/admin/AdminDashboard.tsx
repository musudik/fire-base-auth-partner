import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../db-services/firebase';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [pendingPartners, setPendingPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingPartners();
  }, []);

  const loadPendingPartners = async () => {
    try {
      const q = query(
        collection(firestore, 'partners'),
        where('approvalStatus', '==', 'Pending')
      );
      
      const snapshot = await getDocs(q);
      const partners = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPendingPartners(partners);
    } catch (error) {
      console.error('Error loading partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (partnerId) => {
    try {
      await updateDoc(doc(firestore, 'partners', partnerId), {
        approvalStatus: 'Approved',
        'personalInformation.status': 'Active'
      });
      
      // Refresh list
      loadPendingPartners();
    } catch (error) {
      console.error('Error approving partner:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <h3>Pending Partners</h3>
      
      {pendingPartners.length === 0 ? (
        <p>No pending partners</p>
      ) : (
        <div className="partners-list">
          {pendingPartners.map(partner => (
            <div key={partner.id} className="partner-card">
              <div>
                <p><strong>Name:</strong> {partner.personalInformation.firstName} {partner.personalInformation.lastName}</p>
                <p><strong>Email:</strong> {partner.personalInformation.email}</p>
                <p><strong>Phone:</strong> {partner.personalInformation.phoneNumber}</p>
              </div>
              <button onClick={() => handleApprove(partner.id)}>
                Approve Partner
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 