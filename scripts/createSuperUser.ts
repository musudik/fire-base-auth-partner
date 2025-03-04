// Note: Changed to .js instead of .ts for simpler execution
const admin = require('firebase-admin');
const serviceAccount = require('../gen-wealth-e6322-firebase-adminsdk-fbsvc-d19303f47a.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function createSuperUser() {
  try {
    // Create the user in Firebase Auth
    const userRecord = await auth.createUser({
      email: 'your-admin@email.com', // Change this!
      password: 'YourSecurePassword123!', // Change this!
      displayName: 'System Administrator',
      emailVerified: true
    });

    // Create the super user document in Firestore
    await db.collection('superUsers').doc(userRecord.uid).set({
      email: userRecord.email,
      displayName: userRecord.displayName,
      role: 'SuperAdmin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      permissions: [
        'manage_partners',
        'manage_clients',
        'approve_registrations',
        'view_all_data'
      ],
      status: 'Active'
    });

    console.log('Successfully created super user:', userRecord.uid);
    console.log('Email:', userRecord.email);
    return userRecord;
  } catch (error) {
    console.error('Error creating super user:', error);
    throw error;
  }
}

// Execute the function
createSuperUser()
  .then(() => {
    console.log('Super user creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create super user:', error);
    process.exit(1);
  });