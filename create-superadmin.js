// create-superadmin.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com'
});

async function createSuperAdmin() {
  try {
    // 1. Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: 'superadmin@elbran.com',
      password: 'Abdoa@90@90@90',
      displayName: 'Super Admin',
      emailVerified: true
    });

    console.log('✅ User created in Auth:', userRecord.uid);

    // 2. Create user document in Firestore
    const userDoc = {
      uid: userRecord.uid,
      name: 'Super Admin',
      email: 'superadmin@elbran.com',
      role: 'superadmin',
      allowed_warehouses: ['all'],
      permissions: ['full_access'],
      is_active: true,
      two_factor_enabled: false,
      phone: '',
      notes: 'System Administrator',
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      created_by: 'system',
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_by: 'system'
    };

    await admin.firestore().collection('users').doc(userRecord.uid).set(userDoc);
    
    console.log('✅ User document created in Firestore');
    console.log('✅ Superadmin created successfully!');
    console.log('👤 Email:', userRecord.email);
    console.log('🔑 UID:', userRecord.uid);

    // 3. Set custom claims (for Firebase Functions/security rules)
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'superadmin',
      admin: true
    });

    console.log('✅ Custom claims set');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createSuperAdmin();