import { Injectable } from '@angular/core';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  Auth,
  UserCredential
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor() {}

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(auth);
  }

  // Devuelve el idToken del usuario logueado (o null si no hay nadie logueado).
  // Encapsula el acceso a Firebase aquí para que el resto de la app (p. ej. el
  // interceptor) NO dependa directamente del SDK -> separación de responsabilidades.
  // getIdToken() es asíncrono (devuelve Promesa) porque Firebase puede tener que
  // refrescar el token internamente si está caducado.
  getToken(): Promise<string | null> {
    const user = auth.currentUser;

    // Si no hay usuario logueado, no hay token -> devolvemos null (sin romper el flujo).
    if (!user) {
      return Promise.resolve(null);
    }

    return user.getIdToken();
  }
}