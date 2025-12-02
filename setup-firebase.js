// setup-firebase.js
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDxpbXvFH6UvfE2I6OJ_wNFnA889Zu-NEQ",
  authDomain: "monofia-inventory.firebaseapp.com",
  projectId: "monofia-inventory",
  storageBucket: "monofia-inventory.firebasestorage.app",
  messagingSenderId: "788480597316",
  appId: "1:788480597316:web:776a05277fb4e60806cb11"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupDemoUsers() {
  const demoUsers = [
    { 
      email: 'superadmin@monofia.com', 
      password: '123456',
      profile: {
        role: 'superadmin',
        name: 'المشرف العام',
        allowed_warehouses: ['مخزن شارع الشيخ', 'مخزن الترعه', 'مخزن موقف شبين', 'مخزن هايبر التهامي'],
        permissions: ['all']
      }
    },
    { 
      email: 'warehouse@monofia.com', 
      password: '123456',
      profile: {
        role: 'warehouse_manager',
        name: 'مدير المخازن',
        allowed_warehouses: ['مخزن شارع الشيخ', 'مخزن الترعه'],
        permissions: ['manage_inventory', 'create_transfers', 'view_reports']
      }
    },
    { 
      email: 'company@monofia.com', 
      password: '123456',
      profile: {
        role: 'company_manager',
        name: 'مدير الشركة',
        allowed_warehouses: [],
        permissions: ['view_reports', 'export_data']
      }
    }
  ];

  for (const demoUser of demoUsers) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, demoUser.email, demoUser.password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        email: demoUser.email,
        ...demoUser.profile,
        created_at: new Date()
      });
      
      console.log(`✅ Created user: ${demoUser.email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`ℹ️ User already exists: ${demoUser.email}`);
      } else {
        console.error(`❌ Error creating ${demoUser.email}:`, error.message);
      }
    }
  }
}

setupDemoUsers().then(() => {
  console.log('🎉 Demo users setup completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Setup failed:', error);
  process.exit(1);
});