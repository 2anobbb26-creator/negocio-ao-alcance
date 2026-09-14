import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  updateDoc, 
  Timestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';

// ✅ CONFIGURAÇÃO CORRETA
const firebaseConfig = {
  apiKey: "AIzaSyDWPINcbRAUWxL2j6cbTYxof66qOhHl38w",
  authDomain: "negocio-ao-alcance.firebaseapp.com",
  projectId: "negocio-ao-alcance",
  storageBucket: "negocio-ao-alcance.firebasestorage.app",
  messagingSenderId: "925789845874",
  appId: "1:925789845874:web:e5aba521e7d6fef17405eb",
  measurementId: "G-63GCF5Z85F"
};

console.log('🔥 Firebase inicializado com a chave correta!');
console.log('📁 Project ID:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const authService = {
  // 📝 CADASTRO
  async register(email, password, name, phone) {
    try {
      console.log('📝 Criando usuário...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Usuário criado:', user.uid);
      await updateProfile(user, { displayName: name });
      
      // Tentar salvar no Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          phone: phone || '',
          createdAt: Timestamp.now(),
          favorites: [],
          searchHistory: []
        });
        console.log('✅ Dados salvos no Firestore!');
      } catch (firestoreError) {
        console.warn('⚠️ Firestore não disponível, dados salvos apenas no Authentication');
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Erro no registro:', error.code, error.message);
      return { success: false, error: error.message };
    }
  },

  // 🔑 LOGIN
  async login(email, password) {
    try {
      console.log('🔑 Tentando login...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Login realizado:', user.uid);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Erro no login:', error.code, error.message);
      return { success: false, error: error.message };
    }
  },

  // 🚪 LOGOUT
  async logout() {
    try {
      await signOut(auth);
      console.log('✅ Logout realizado');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro no logout:', error.code, error.message);
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
      console.warn('⚠️ Erro ao buscar usuário:', error.message);
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
      console.warn('⚠️ Erro ao atualizar:', error.message);
      return { success: false, error: error.message };
    }
  },

  // ⭐ FAVORITOS
  async addFavorite(uid, businessId) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const favorites = userData.favorites || [];
      
      if (!favorites.includes(businessId)) {
        favorites.push(businessId);
        await updateDoc(userRef, { favorites });
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
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const favorites = userData.favorites || [];
      
      const newFavorites = favorites.filter(id => id !== businessId);
      await updateDoc(userRef, { favorites: newFavorites });
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao remover favorito:', error);
      return { success: false, error: error.message };
    }
  },

  // 📜 HISTÓRICO
  async saveSearchHistory(uid, searchData) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const history = userData.searchHistory || [];
      
      history.unshift({
        budget: searchData.budget,
        category: searchData.category,
        timestamp: Timestamp.now(),
        results: searchData.results
      });
      
      if (history.length > 10) {
        history.pop();
      }
      
      await updateDoc(userRef, { searchHistory: history });
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao salvar histórico:', error);
      return { success: false, error: error.message };
    }
  }
};

export { auth, db };