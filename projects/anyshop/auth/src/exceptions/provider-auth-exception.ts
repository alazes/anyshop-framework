import {
  FacebookSignInResult,
  GoogleSignInResult,
  TwitterSignInResult,
} from 'capacitor-firebase-auth';
import firebase from 'firebase/app';

import { IProviderUserData } from '../interfaces';

import { SignInResult } from '../services/user/facades';

import Exception from './exception';

/**
 * Error generado a partir del proceso de autenticación.
 */
export default class ProviderAuthException extends Exception<IProviderUserData> {
  constructor(
    code: string,
    message: string,
    data: IProviderUserData = {},
    public readonly result?: SignInResult,
    innerError?: Error | any
  ) {
    super({ code, message, data, innerError });
  }

  get credential(): firebase.auth.OAuthCredential | undefined {
    let credential: firebase.auth.OAuthCredential | undefined;

    if (this.result) {
      switch (this.result.providerId) {
        case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
        case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
          credential = firebase.auth.FacebookAuthProvider.credential(
            (this.result as FacebookSignInResult | GoogleSignInResult).idToken
          );
          break;

        case firebase.auth.TwitterAuthProvider.PROVIDER_ID:
          const r = this.result as TwitterSignInResult;
          credential = firebase.auth.TwitterAuthProvider.credential(
            r.idToken,
            r.secret
          );
          break;

        default:
          // TODO: Compatibilidad con los demás providers
          console.error(
            `credential() no implementado para '${this.result.providerId}'. `,
            this.result
          );
          break;
      }
    }

    return credential;
  }
}
