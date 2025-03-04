import { firestore } from './firebase';
import { Partner } from '../model/types';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    getDocs
} from 'firebase/firestore';

export class PartnerService {
    private readonly PARTNERS_PATH = 'partners';

    // Create a new partner
    async createPartner(partner: Partner): Promise<void> {
        try {
            await setDoc(
                doc(firestore, this.PARTNERS_PATH, partner.partnerId),
                partner
            );
        } catch (error) {
            throw new Error(`Failed to create partner: ${error}`);
        }
    }

    // Get partner by ID
    async getPartnerById(partnerId: string): Promise<Partner | null> {
        try {
            const partnerDoc = await getDoc(
                doc(firestore, this.PARTNERS_PATH, partnerId)
            );
            return partnerDoc.exists() ? partnerDoc.data() as Partner : null;
        } catch (error) {
            throw new Error(`Failed to get partner: ${error}`);
        }
    }

    // Update partner information
    async updatePartner(partnerId: string, updates: Partial<Partner>): Promise<void> {
        try {
            await updateDoc(
                doc(firestore, this.PARTNERS_PATH, partnerId),
                updates
            );
        } catch (error) {
            throw new Error(`Failed to update partner: ${error}`);
        }
    }

    // Delete partner
    async deletePartner(partnerId: string): Promise<void> {
        try {
            await deleteDoc(doc(firestore, this.PARTNERS_PATH, partnerId));
        } catch (error) {
            throw new Error(`Failed to delete partner: ${error}`);
        }
    }

    // Get all partners
    async getAllPartners(): Promise<Partner[]> {
        try {
            const querySnapshot = await getDocs(collection(firestore, this.PARTNERS_PATH));
            return querySnapshot.docs.map(doc => doc.data() as Partner);
        } catch (error) {
            throw new Error(`Failed to get all partners: ${error}`);
        }
    }

    // Get partners by hierarchy
    async getPartnersByHierarchy(hierarchyId: string): Promise<Partner[]> {
        try {
            const q = query(
                collection(firestore, this.PARTNERS_PATH),
                where("hierarchyId", "==", hierarchyId)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data() as Partner);
        } catch (error) {
            throw new Error(`Failed to get partners by hierarchy: ${error}`);
        }
    }
}
