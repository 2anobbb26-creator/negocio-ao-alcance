import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateAuthProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  updateDoc, 
  Timestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWPINcbRAUWxL2j6cbTYxof66qOhHl38w",
  authDomain: "negocio-ao-alcance.firebaseapp.com",
  projectId: "negocio-ao-alcance",
  storageBucket: "negocio-ao-alcance.firebasestorage.app",
  messagingSenderId: "925789845874",
  appId: "1:925789845874:web:e5aba521e7d6fef17405eb",
  measurementId: "G-63GCF5Z85F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const authService = {
  // 📝 REGISTRO
  async register(email, password, name, phone) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateAuthProfile(user, { displayName: name });
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        phone: phone || '',
        createdAt: Timestamp.now(),
        favorites: [],
        searchHistory: []
      });
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Erro no registro:', error.code, error.message);
      return { success: false, error: error.message };
    }
  },

  // 🔑 LOGIN
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('❌ Erro no login:', error.code, error.message);
      return { success: false, error: error.message };
    }
  },

  // 🚪 LOGOUT
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // 👤 OBSERVAR MUDANÇAS
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // 📊 BUSCAR DADOS DO USUÁRIO
  async getUserData(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      }
      return { success: false, error: 'Usuário não encontrado' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ✏️ ATUALIZAR DADOS
  async updateUserData(uid, data) {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ✏️ ATUALIZAR PERFIL (NOME + TELEFONE)
  async updateProfile(user, data) {
    try {
      if (data.name) {
        await updateAuthProfile(auth.currentUser, { displayName: data.name });
      }

      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name: data.name,
        phone: data.phone,
        updatedAt: Timestamp.now()
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      return { success: false, error: error.message };
    }
  },

  // ⭐ ADICIONAR FAVORITO
  async addFavorite(uid, businessId) {
    try {
      console.log('⭐ Adicionando favorito:', uid, businessId);
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.error('❌ Usuário não encontrado no Firestore');
        return { success: false, error: 'Usuário não encontrado' };
      }
      
      const userData = userSnap.data();
      const favorites = userData.favorites || [];
      
      if (!favorites.includes(businessId)) {
        favorites.push(businessId);
        await updateDoc(userRef, { favorites });
        console.log('✅ Favorito adicionado:', favorites);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao adicionar favorito:', error);
      return { success: false, error: error.message };
    }
  },

  // ❌ REMOVER FAVORITO
  async removeFavorite(uid, businessId) {
    try {
      console.log('❌ Removendo favorito:', uid, businessId);
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return { success: false, error: 'Usuário não encontrado' };
      }
      
      const userData = userSnap.data();
      const favorites = userData.favorites || [];
      
      const newFavorites = favorites.filter(id => id !== businessId);
      await updateDoc(userRef, { favorites: newFavorites });
      console.log('✅ Favorito removido:', newFavorites);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao remover favorito:', error);
      return { success: false, error: error.message };
    }
  },

  // 📋 BUSCAR FAVORITOS
  async getFavorites(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return { success: true, data: [] };
      }
      
      const userData = userSnap.data();
      return { success: true, data: userData.favorites || [] };
    } catch (error) {
      console.error('❌ Erro ao buscar favoritos:', error);
      return { success: false, error: error.message, data: [] };
    }
  }
};

export { auth, db };