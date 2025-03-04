import {firestore } from './firebase';
import { Client } from '../model/types';
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

export class ClientService {
    private readonly CLIENTS_PATH = 'clients';

    // Create a new client
    async createClient(client: Client): Promise<void> {
        try {
            await setDoc(
                doc(firestore, this.CLIENTS_PATH, client.clientId),
                client
            );
        } catch (error) {
            throw new Error(`Failed to create client: ${error}`);
        }
    }

    // Get client by ID
    async getClientById(clientId: string): Promise<Client | null> {
        try {
            const clientDoc = await getDoc(
                doc(firestore, this.CLIENTS_PATH, clientId)
            );
            return clientDoc.exists() ? clientDoc.data() as Client : null;
        } catch (error) {
            throw new Error(`Failed to get client: ${error}`);
        }
    }

    // Update client information
    async updateClient(clientId: string, updates: Partial<Client>): Promise<void> {
        try {
            await updateDoc(
                doc(firestore, this.CLIENTS_PATH, clientId),
                updates
            );
        } catch (error) {
            throw new Error(`Failed to update client: ${error}`);
        }
    }

    // Delete client
    async deleteClient(clientId: string): Promise<void> {
        try {
            await deleteDoc(doc(firestore, this.CLIENTS_PATH, clientId));
        } catch (error) {
            throw new Error(`Failed to delete client: ${error}`);
        }
    }

    // Get all clients for a partner
    async getClientsByPartnerId(partnerId: string): Promise<Client[]> {
        try {
            const q = query(
                collection(firestore, this.CLIENTS_PATH),
                where("partnerId", "==", partnerId)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data() as Client);
        } catch (error) {
            throw new Error(`Failed to get clients by partner: ${error}`);
        }
    }

    // Get all clients
    async getAllClients(): Promise<Client[]> {
        try {
            const querySnapshot = await getDocs(collection(firestore, this.CLIENTS_PATH));
            return querySnapshot.docs.map(doc => doc.data() as Client);
        } catch (error) {
            throw new Error(`Failed to get all clients: ${error}`);
        }
    }

    // Update client status (can be used for approval/rejection)
    async updateClientStatus(clientId: string, status: "Active" | "Inactive" | "Suspended"): Promise<void> {
        try {
            await updateDoc(
                doc(firestore, this.CLIENTS_PATH, clientId),
                {
                    "personalInformation.status": status
                }
            );
        } catch (error) {
            throw new Error(`Failed to update client status: ${error}`);
        }
    }
}
