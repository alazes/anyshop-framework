import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  FacebookSignInResult,
  GoogleSignInResult,
  SignInOptions,
} from 'capacitor-firebase-auth/alternative';
import firebase from 'firebase/app';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { ProviderId } from '../../declarations';
import { Exception, ProviderAuthException } from '../../exceptions';
import { IProviderUserData } from '../../interfaces';
import { UserAccountInterface } from '../../interfaces/user-account.interface';

import { ArxisAuthAbstractService } from './auth-abstract.service';
import { cfaSignIn, cfaSignOut, SignInResult } from './facades';

@Injectable({
  providedIn: 'root',
})
export class ArxisFireAuthService extends ArxisAuthAbstractService {
  authState: Observable<firebase.User | null>;

  /**
   * Shared current authenticated user.
   */
  readonly user$: Observable<firebase.User | null>;

  constructor(public afAuth: AngularFireAuth) {
    // super(db, firebasePlugin, platform);
    super();
    this.authState = this.afAuth.authState;
    this.user$ = this.afAuth.user.pipe(share());

    // this.afAuth.onIdTokenChanged((user) => { // 💩 No funciona, en realidad no se dispara aunque se verifique email
    //   console.log(`onIdTokenChanged(): UID: ${user?.uid}`); // 🚧 DEBUG
    //   this.syncRegistrationStatus();
    // });

    this.initUser();
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  async login<T extends { email: string; password: string }>(accountInfo: T) {
    const seq = await this.afAuth.signInWithEmailAndPassword(
      accountInfo.email,
      accountInfo.password
    );

    if (!seq.user) {
      throw Error('No user');
    }

    const user = seq.user as UserAccountInterface;

    this._loggedIn(user);

    return user;
  }

  loginWithCredential(
    credential: firebase.auth.AuthCredential
  ): Promise<firebase.auth.UserCredential> {
    const promise: Promise<firebase.auth.UserCredential> = this.afAuth
      .signInWithCredential(credential)
      .then((userCredential: firebase.auth.UserCredential) => userCredential);
    return promise;
  }

  /**
   *
   * @deprecated Use loginWithFacebook() instead
   */
  loginFB() {
    const provider = new firebase.auth.FacebookAuthProvider();

    return this.afAuth
      .signInWithPopup(provider)
      .then((credential) => credential)
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: { email: string; password: string }) {
    const seq = this.afAuth
      .createUserWithEmailAndPassword(accountInfo.email, accountInfo.password)
      .then((res: firebase.auth.UserCredential) => res.user);
    seq
      .then((newUser) => {
        // this.preSavedAccountInfo=accountInfo;
        this._loggedIn(newUser as UserAccountInterface);
        return newUser;
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        console.error('ERROR', error);
      });

    return seq as Promise<any>;
  }

  async isValidEmailForSignUp(email: string) {
    try {
      const methods = await this.afAuth.fetchSignInMethodsForEmail(email);
      const hasPasswordMethod: boolean =
        methods.findIndex(
          (method) =>
            // FIXME: Usar la constante auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD en vez de 'password'

            method === 'password'
        ) !== -1;

      if (!hasPasswordMethod) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchSignInMethodsForEmail(email: string): Promise<string[]> {
    return await this.afAuth.fetchSignInMethodsForEmail(email);
  }

  async fetchSignInMethodsForUser<T extends firebase.User>(
    user: T
  ): Promise<string[]> {
    const { email } = user;

    if (!email) {
      throw new Exception('User has not email set');
    }

    const methods = await this.fetchSignInMethodsForEmail(email);

    // 🐛 fetchSignInMethodsForEmail no se trae el método de teléfono,
    // por eso hay que agregarlo manualmente si el usuario tiene la data
    if (
      !methods.includes(firebase.auth.PhoneAuthProvider.PHONE_SIGN_IN_METHOD)
    ) {
      if (user.providerData) {
        const phoneProvider = user.providerData.find(
          (provider) =>
            provider &&
            provider.providerId === firebase.auth.PhoneAuthProvider.PROVIDER_ID
        );

        if (phoneProvider) {
          methods.push(firebase.auth.PhoneAuthProvider.PHONE_SIGN_IN_METHOD);
        }
      }
    }

    return methods;
  }

  async fetchSignInMethodsForCurrentUser(): Promise<string[]> {
    if (!this.currentUser) {
      throw new Exception('No authenticated user');
    }

    return await this.fetchSignInMethodsForUser(this.currentUser);
  }

  /**
   *
   * @param  signInMethod El método de inicio de sesión (ej auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)
   */
  async emailHasSignInMethod(
    email: string,
    signInMethod: string
  ): Promise<boolean> {
    const methods = await this.fetchSignInMethodsForEmail(email);

    return methods.includes(signInMethod);
  }

  /**
   *
   * @param  signInMethod El método de inicio de sesión (ej auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)
   */
  async userHasSignInMethod<T extends firebase.User>(
    user: T,
    signInMethod: string
  ): Promise<boolean> {
    const methods = await this.fetchSignInMethodsForUser(user);

    return methods.includes(signInMethod);
  }

  /**
   *
   * @param  signInMethod El método de inicio de sesión (ej auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)
   */
  async currentUserHasSignInMethod(signInMethod: string): Promise<boolean> {
    if (!this.currentUser) {
      throw new Exception('No authenticated user');
    }

    return await this.userHasSignInMethod(this.currentUser, signInMethod);
  }

  /**
   * Check if user has provider
   *
   * @deprecated Usar más bien el método userHasSignInMethod(). No es correcto buscar por provider,
   *   sino al método. Ya que, por ejemplo, el correo tiene contraseña y link. Ej.: auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
   */
  hasProvider<T extends firebase.User>(user: T | null, providerId: string) {
    if (!user) {
      return false;
    }

    if (!user.providerData) {
      console.warn('User sin providerData', JSON.stringify(user, null, 2));
      return false;
    }

    const index = user.providerData.findIndex(
      (userInfo) => userInfo?.providerId === providerId
    );

    return index !== -1;
  }

  createEmailCredential(email: string, password: string) {
    return firebase.auth.EmailAuthProvider.credential(email, password);
  }

  async linkAccount(
    credential: firebase.auth.AuthCredential
  ): Promise<firebase.auth.UserCredential> {
    if (!this.currentUser) {
      throw new Exception({ code: 'user-no-auth', message: 'user-no-auth' });
    }

    return await this.currentUser.linkWithCredential(credential);
  }

  /**
   * @deprecated Usar currentUser.updateProfile()
   */
  updateDisplayName(name: string) {
    if (!this.currentUser) {
      throw new Exception('No authenticated user');
    }

    return this.currentUser.updateProfile({
      displayName: name,
      photoURL: this.currentUser.photoURL,
    });
  }

  /**
   * @deprecated Usar currentUser.updatePassword()
   */
  updateEmail(email: string) {
    if (!this.currentUser) {
      throw new Exception('No authenticated user');
    }

    return this.currentUser.updateEmail(email);
  }

  /**
   * @deprecated Usar currentUser.updatePassword()
   */
  updatePassword(password: string) {
    if (!this.currentUser) {
      throw new Exception('No authenticated user');
    }

    return this.currentUser.updatePassword(password);
  }

  /**
   * Call sign out method on native and web layers.
   */
  async logout(): Promise<void> {
    await cfaSignOut();

    this.currentUser = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn<T extends UserAccountInterface>(currentUser: T | null) {
    this.currentUser = currentUser; // res.user en code movil
  }

  setAuthState() {
    this.authState = this.afAuth.authState;
  }

  initUser() {
    return this.authState.subscribe(
      (user) => {
        this._loggedIn(user as UserAccountInterface);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**
   * Intenta iniciar sesión con el provider especificado de forma nativa y extenderlo a web.
   *
   * @param allowIncompleteRegister Indica si se mantiene la cuenta aunque no haya verificado su teléfono o contraseña.
   *   Si es falso, disparará una ProviderAuthException ({ code: 'auth/unregistered' }) que contendrá las credenciales
   *   para enlazar con la cuenta completa luego.
   *
   * ### Known issues:
   * - Al iniciar sesión con Google, la contraseña se reemplaza (elimina) si ya posee una cuenta de
   *   google. Para evitar esto, se debe verificar el correo al momento del registro.
   *
   * @throws ProviderAuthException
   */
  async loginWith(
    providerId: ProviderId,
    allowIncompleteRegister = false,
    phoneData?: SignInOptions,
    nativeOnly?: boolean
  ) {
    try {
      // let credentialResult = (await cfaSignIn(providerId, undefined, true));
      //
      // if (providerId === 'facebook.com') {
      //   credentialResult = credentialResult as NativeOnlySignInCredential<FacebookSignInResult>;
      // } else {
      //   credentialResult = credentialResult as NativeOnlySignInCredential<GoogleSignInResult>;
      // }

      const { result, userCredential } = await cfaSignIn(providerId);
      const user = userCredential.user as firebase.User;

      // console.log(
      //   `cfaSignIn(${providerId}): `,
      //   JSON.stringify({ result, userCredential }, null, 2)
      // );

      let methods = await this.fetchSignInMethodsForUser(user);

      // console.log(
      //   `Antes del reload: fetchSignInMethodsForUser(${user.email}): `,
      //   JSON.stringify(methods, null, 2)
      // );

      await user.reload();

      methods = await this.fetchSignInMethodsForUser(user);
      // console.log(
      //   `Después del reload: fetchSignInMethodsForUser(${user.email}): `,
      //   JSON.stringify(methods, null, 2)
      // );

      // return user;

      // if (auth().currentUser) {
      //   auth().currentUser?.linkWithCredential()
      // }

      // Comprueba si el usuario no ha completado el registro con su teléfono, si no se permite...
      if (
        !allowIncompleteRegister &&
        !methods.includes(firebase.auth.PhoneAuthProvider.PHONE_SIGN_IN_METHOD)
      ) {
        // TODO: Tener en cuenta cuando no tiene teléfono pero tiene su correo autenticado
        const data: IProviderUserData = {
          email: user?.email ?? undefined,
          name: user?.displayName ?? undefined,
          phone: user?.phoneNumber ?? undefined,
        };

        await cfaSignOut();

        const onlyThisProvider = methods.length === 1;

        // Sólo lo elimina si sólo contiene el provider con el que se está intentando crear la cuenta
        if (onlyThisProvider) {
          // console.log('Eliminando cuenta');

          await user.delete();
        } else {
          // console.log('Unlink provider ' + result.providerId);
          // Si tiene otro provider, sólo elimina este.
          await user.unlink(result.providerId);
        }

        throw new ProviderAuthException(
          onlyThisProvider
            ? 'auth/unregistered'
            : 'auth/account-exists-with-different-credential',
          `User with email '${user.email}' has not completed its registration.`,
          data,
          result
        );
      }

      return user;
    } catch (err) {
      if (err instanceof ProviderAuthException) {
        throw err;
      }

      // console.log(`Falló algo antes: `, JSON.stringify(err, null, 2));

      const {
        oauthAccessToken,
        message,
        email,
        displayName,
        phoneNumber,
      } = JSON.parse(JSON.stringify(err)) as {
        [i: string]: string | undefined;
      };

      let result: SignInResult | undefined;

      if (email) {
        const methods = await this.fetchSignInMethodsForEmail(email);

        // console.log(
        //   `fetchSignInMethodsForEmail(${email}): `,
        //   JSON.stringify(methods, null, 2)
        // );
      }

      if (oauthAccessToken) {
        switch (providerId) {
          case 'google.com':
            result = new GoogleSignInResult(oauthAccessToken);
            break;

          case 'facebook.com':
            result = new FacebookSignInResult(oauthAccessToken);
            break;

          default:
            result = undefined;
            break;
        }
      }

      throw new ProviderAuthException(
        err.code,
        message || '',
        {
          email,
          name: displayName,
          phone: phoneNumber,
        },
        result,
        err
      );
    }
  }

  /**
   * Intenta iniciar sesión con Facebook de forma nativa y extenderlo a web.
   *
   * @param allowNew Indica si se mantiene la cuenta sin contraseña.
   *   Si es falso, disparará una ProviderAuthException ({ code: 'auth/unregistered' }) que contendrá las credenciales
   *   para enlazar con la cuenta completa luego.
   *
   * @throws ProviderAuthException
   */
  async loginWithFacebook(allowNew = false) {
    return await this.loginWith('facebook.com', allowNew);
  }

  /**
   * Intenta iniciar sesión con Google de forma nativa y extenderlo a web.
   *
   * @param allowNew Indica si se mantiene la cuenta sin contraseña.
   *   Si es falso, disparará una ProviderAuthException ({ code: 'auth/unregistered' }) que contendrá las credenciales
   *   para enlazar con la cuenta completa luego.
   *
   * @throws ProviderAuthException
   */
  async loginWithGoogle(allowNew = false) {
    return await this.loginWith('google.com', allowNew);
  }
}
