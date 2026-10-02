import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateAuthProfile,
  sendEmailVerification,
  reload
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

// ✅ CORREÇÃO: passar 'default' como segundo argumento
// porque o banco no console se chama "default" (sem parênteses)
const db = getFirestore(app, 'default');

export const authService = {
  // 📝 REGISTRO (com envio de e-mail de verificação)
  async register(email, password, name, phone) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateAuthProfile(user, { displayName: name });
      
      // 📧 Envia e-mail de verificação
      try {
        await sendEmailVerification(user, {
          url: 'https://negocio-ao-alcance.web.app/login',
          handleCodeInApp: false
        });
        console.log('📧 E-mail de verificação enviado para:', email);
      } catch (emailError) {
        console.warn('⚠️ Erro ao enviar e-mail de verificação:', emailError);
      }
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        phone: phone || '',
        createdAt: Timestamp.now(),
        favorites: [],
        searchHistory: [],
        emailVerified: false
      });
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Erro no registro:', error.code, error.message);
      return { success: false, error: error.message };
    }
  },

  // 🔑 LOGIN (com verificação de e-mail)
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔄 Força atualização do estado (para pegar emailVerified atualizado)
      await reload(user);

      // 🚫 Bloqueia login se e-mail não verificado
      if (!user.emailVerified) {
        return { 
          success: false, 
          error: 'EMAIL_NOT_VERIFIED',
          user: user
        };
      }

      // Garante que o documento existe no Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.warn('⚠️ Documento do usuário não existe. Criando...');
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          favorites: [],
          searchHistory: [],
          createdAt: Timestamp.now(),
          emailVerified: true
        });
      } else {
        // Atualiza o status de verificação no Firestore
        await updateDoc(userRef, { emailVerified: true });
      }

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

  // ⭐ ADICIONAR FAVORITO (com auto-criação do documento)
  async addFavorite(uid, businessId) {
    try {
      console.log('⭐ Adicionando favorito:', uid, businessId);
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      let favorites = [];
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        favorites = userData.favorites || [];
      } else {
        console.warn('⚠️ Documento do usuário não existe. Criando...');
        await setDoc(userRef, {
          uid: uid,
          favorites: [],
          searchHistory: [],
          createdAt: Timestamp.now()
        });
      }
      
      if (!favorites.includes(businessId)) {
        favorites.push(businessId);
        await updateDoc(userRef, { favorites });
        console.log('✅ Favorito adicionado:', favorites);
      } else {
        console.log('ℹ️ Favorito já estava na lista');
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
        console.warn('⚠️ Documento não existe, nada a remover');
        return { success: true };
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
  },

  // 📧 REENVIAR E-MAIL DE VERIFICAÇÃO
  async resendVerificationEmail() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Usuário não logado' };
      }

      if (user.emailVerified) {
        return { success: false, error: 'E-mail já verificado' };
      }

      await sendEmailVerification(user, {
        url: 'https://negocio-ao-alcance.web.app/login',
        handleCodeInApp: false
      });

      console.log('📧 E-mail de verificação reenviado para:', user.email);
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao reenviar e-mail:', error);
      return { success: false, error: error.message };
    }
  },

  // 🔄 RECARREGAR USUÁRIO (verifica se e-mail foi confirmado)
  async reloadUser() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Usuário não logado' };
      }

      await reload(user);

      // Atualiza o Firestore se agora está verificado
      if (user.emailVerified) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, { emailVerified: true });
        } catch (dbError) {
          console.warn('⚠️ Erro ao atualizar Firestore:', dbError);
        }
      }

      return { 
        success: true, 
        emailVerified: user.emailVerified 
      };
    } catch (error) {
      console.error('❌ Erro ao recarregar usuário:', error);
      return { success: false, error: error.message };
    }
  }
};

export { auth, db };