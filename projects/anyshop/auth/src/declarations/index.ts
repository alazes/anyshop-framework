import { SignInResult } from 'capacitor-firebase-auth';
import firebase from 'firebase/app';

export type FacebookProviderId = 'facebook.com';
export type GoogleProviderId = 'google.com';
export type TwitterProviderId = 'twitter.com';
export type PhoneProviderId = 'phone';
export type ProviderId =
  | FacebookProviderId
  | GoogleProviderId
  | TwitterProviderId
  | PhoneProviderId
  | 'password'
  // Other
  | 'playgames.google.com'
  | 'github.com';

/**
 * Credenciales cuando se inicia sesión y se crea el usuario en Firebase.
 */
export interface SignInCredential<T extends SignInResult> {
  userCredential: firebase.auth.UserCredential;
  result: T;
}

/**
 * Credenciales cuando sólo se inicia sesión en la capa nativa.
 */
export interface NativeOnlySignInCredential<T extends SignInResult> {
  credential: firebase.auth.OAuthCredential;
  result: T;
}

/**
 * Indica la info que ya tiene, o no, establecida el usuario.
 */
export interface UserRegistrationStatusData {
  name?: boolean;
  email?: boolean;
  verifiedEmail?: boolean;

  phone?: boolean;
  password?: boolean;
}

/**
 * Indica la info que ya tiene, o no, establecida el usuario.
 *
 * Si alguna info está pendiente, será undefined.
 */
export class UserRegistrationStatus implements UserRegistrationStatusData {
  name: boolean | undefined;
  email: boolean | undefined;
  verifiedEmail: boolean | undefined;
  password: boolean | undefined;
  phone: boolean | undefined;

  constructor({
    name,
    email,
    password,
    verifiedEmail,
    phone,
  }: UserRegistrationStatusData = {}) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.verifiedEmail = verifiedEmail;
    this.phone = phone;
  }
}
