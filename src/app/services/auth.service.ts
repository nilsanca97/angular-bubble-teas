import { Injectable, signal, computed } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  Auth,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Fuente de verdad reactiva de la sesión: el usuario de Firebase (o null).
  // PRIVADO a propósito: encapsulamos el SDK aquí; el resto de la app NO recibe
  // tipos de Firebase (mismo criterio que el interceptor). Lo rellena onAuthStateChanged.
  private currentUser = signal<FirebaseUser | null>(null);

  // API PÚBLICA estrecha: "¿hay sesión?" como signal de solo lectura. Los consumidores
  // (p. ej. Home) gatean con esto sin conocer Firebase. Si más adelante hiciera falta
  // exponer email/uid, se añade aquí derivándolo del mismo signal privado.
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    // onAuthStateChanged es la fuente de verdad canónica de Firebase: dispara cuando
    // se resuelve la sesión (incluida la restauración tras recargar la página) y en
    // cada login/logout. NO desuscribimos a propósito: el servicio es providedIn:'root'
    // y el listener debe vivir lo que vive la app.
    onAuthStateChanged(auth, (user) => this.currentUser.set(user));
  }

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