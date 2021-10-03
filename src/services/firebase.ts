import { initializeApp } from '@firebase/app';
import {
  AuthError,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from '@firebase/auth';
import { ApplicationError, ErrorCode } from '../models/applicationError';
import { User } from '../models/User';
export { onAuthStateChanged };
export type { FirebaseUser };

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Get different firebase services
export const auth = getAuth(firebase);

export async function createUser(email: string, password: string) {
  await createUserWithEmailAndPassword(auth, email, password);
}

export async function signInUserByEmail(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function sendUserVerification(user: FirebaseUser) {
  await sendEmailVerification(user);
}

export function mapFirebaseAuthError(error: AuthError): ApplicationError {
  function createApplicationError(code: ErrorCode): ApplicationError {
    return { code, message: error.message };
  }

  switch (error.code) {
    case 'auth/weak-password':
      return createApplicationError(ErrorCode.INVALID_PASSWORD);
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return createApplicationError(ErrorCode.INCORRECT_CREDENTIALS);
    case 'auth/email-already-in-use':
      return createApplicationError(ErrorCode.USER_ALREADY_EXISTS);
    default:
      return createApplicationError(ErrorCode.UNKNOWN_ERROR);
  }
}

export function MapFirebaseUser(user: FirebaseUser): User {
  return {
    email: user.email!,
    isVerified: user.emailVerified,
  };
}