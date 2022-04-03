import { Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {
  ArxisDeviceService,
  ArxisSmsAuthService,
  ArxisIonicFireStoreAuthService as ArxisUser,
  ROUTE_FCM_DOC,
} from '@anyshop/auth';
import {
  UserAccountInterface,
  Account,
  Address,
  Business,
} from '@anyshop/core';
import { ApiService } from '@arxis/api';
import { Platform } from '@ionic/angular';
// import { Pro } from '@ionic/pro';
import firebase from 'firebase/app';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService extends ArxisUser {
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  confirmationResult: any;
  preSavedAccountInfo: any;
  verificationId: any;
  primaryAddress: Address;
  primaryAddressDoc: AngularFirestoreCollection<any>;
  primaryBusiness: Business;
  primaryBusinessDoc: AngularFirestoreDocument<any>;
  readyState: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public api: ApiService,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    // public firebasePlugin: Firebase,
    public device: ArxisDeviceService,
    public platform: Platform,
    @Inject(ROUTE_FCM_DOC) routeFCMDoc: string,
    private sms: ArxisSmsAuthService
  ) {
    super(afAuth, afs, device, platform, routeFCMDoc);
  }

  authFillAction(user: firebase.User): Observable<any> {
    return super.authFillAction(user).pipe(
      switchMap((u) => {
        if (u) {
          return u;
        } else {
          return of(null);
        }
      }),
      switchMap((u: firebase.User | null) => {
        if (u) {
          return of(u).pipe(
            switchMap((us) =>
              this.getPrimaryBusiness(us.uid).pipe(
                switchMap((business: Business) => {
                  console.log('negocio encontrado', business);
                  if (business) {
                    this.primaryBusinessDoc = this.afs
                      .collection('businesses')
                      .doc(business.key);
                    this.primaryBusiness = business;
                    this.primaryAddress = business.address;
                  }
                  return of(us);
                })
              )
            )
          );
        } else {
          return of(null);
        }
      })
    );
  }

  /**
   * Forza la actualización de la info del negocio del usuario.
   */
  async syncPrimaryBusiness(): Promise<Business | null> {
    if (this.currentUserId) {
      const business = await this.getPrimaryBusiness(this.currentUserId)
        .pipe(first())
        .toPromise();

      if (!business || !business.key) {
        this.primaryBusinessDoc = null;
        this.primaryBusiness = null;
        this.primaryAddress = null;
      } else {
        this.primaryBusinessDoc = this.afs
          .collection('businesses')
          .doc(business.key);
        this.primaryBusiness = business;
        this.primaryAddress = business.address;
      }
    } else {
      this.primaryBusinessDoc = null;
      this.primaryBusiness = null;
      this.primaryAddress = null;
    }

    return this.primaryBusiness;
  }

  getPrimaryBusiness(currentUserId: string): Observable<null | Business> {
    const primaryBusinessFilteFunction = (ref) =>
      ref.where('owner', '==', currentUserId).limit(1);
    const primaryBusinessQuery = this.afs.collection<Business>(
      'businesses',
      primaryBusinessFilteFunction
    );

    return primaryBusinessQuery.snapshotChanges().pipe(
      map((list) => list.map<Business>(this.mapElements)),
      switchMap((businesses) => {
        if (!businesses) {
          return of(null);
        }
        return of(businesses[0]);
      })
    );
  }

  mapElements(action) {
    const itemEl = action.payload.doc.data();
    itemEl.key = action.payload.doc.id;

    return itemEl;
  }

  /**
   * @deprecated User loginWith('facebook.com')
   */
  loginFB(): Promise<firebase.auth.UserCredential> {
    const provider = new firebase.auth.FacebookAuthProvider();

    return this.afAuth
      .signInWithPopup(provider)
      .then((credential) => credential)
      .catch((error) => {
        throw error;
      });
  }

  sendSMSVerification(
    phone: string,
    verifier?: firebase.auth.RecaptchaVerifier
  ): Promise<string> {
    return this.sms.sendSMSVerification(phone, verifier);
  }

  sendSMSVerificationAlternative(
    phone: string,
    verifier?: firebase.auth.RecaptchaVerifier
  ): Promise<firebase.auth.UserCredential> {
    return this.sms.sendSMSVerificationAndroidAlternative(phone);
  }

  sendSMSVerificationIOS(phone: string) {
    return this.sms.sendSMSVerificationIOS(phone);
  }

  async confirm(
    code: string,
    verificationId: string
  ): Promise<firebase.auth.UserCredential> {
    const phoneCredential = await this.sms.confirm(code, verificationId);
    let userCredential: firebase.auth.UserCredential;
    try {
      userCredential = await this.loginWithCredential(phoneCredential)
        .then((result: firebase.auth.UserCredential) => result)
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      return Promise.reject(error);
    }

    return Promise.resolve(userCredential);
  }

  async registerPasswordAndLink(
    email: string,
    password: string,
    data: { [key: string]: any }
  ): Promise<firebase.auth.UserCredential> {
    const credential = this.createEmailCredential(email, password);

    const userCredential = await this.linkAccount(credential);

    if (data.name) {
      userCredential.user.updateProfile({ displayName: data.name });
    }

    await userCredential.user.reload();

    await this.updateUserData(
      data,
      userCredential.user as UserAccountInterface,
      true
    );

    return userCredential;
  }

  /**
   * Sincroniza los datos de autenticación del usuario con su documento en Firestore.
   *
   * Por defecto se agregan los metadatos principales del usuario (nombre, teléfono y correo principal).
   *
   * @param accountInfo Datos extra del usuario.
   */
  async updateUserData<TUser extends firebase.User>(
    accountInfo: { [key: string]: any } = {},
    user?: TUser,
    isNewUser?: boolean
  ): Promise<boolean> {
    // let path = `users/${this.currentUserId}`; // Endpoint on firebase
    user = user || (this.currentUser as unknown as TUser);

    if (!user) {
      return Promise.reject({ code: 'user-no-auth', message: 'user-no-auth' });
    }

    const data = _.omitBy(
      {
        ..._.omitBy(accountInfo, _.isNil),
        email: user.email || accountInfo.email,
        phone: user.phoneNumber || accountInfo.phone,
        name: user.displayName || accountInfo.name,
      },
      _.isNil
    );

    if (!isNewUser) {
      // await this.updateProfile(data).catch(error =>
      //   console.log('error al actualizar update profile', error)
      // );
    } else {
      // await this.updateDisplayName(data.name);
    }

    const userDoc = this.afs.collection('users').doc(user.uid);

    await userDoc.set(data, { merge: true });

    return true;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    const logout = super
      .logout()
      .then(() => {
        this.emptyUserData();
        this.readyState.next(false);
      })
      .catch((error) => {
        // An error happened.
        console.log(error.message);
      });

    return logout;
  }

  emptyUserData() {
    // this.closeSubscriptions();
    this.userFireStoreDoc = null;
    // this.userFireStoreShards = null;
    this.primaryAddress = null;
    this.primaryAddressDoc = null;
    this.primaryBusiness = null;
    this.primaryBusinessDoc = null;
    this.readyState.next(false);
  }

  displayName() {
    if (this.authenticated) {
      if (this.currentUser.displayName) {
        return this.currentUser.displayName;
      } else if (this.currentUser) {
        return this.currentUser.name;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  get photoURL() {
    if (this.authenticated) {
      if (this.currentUser.photoURL) {
        return this.currentUser.photoURL || null;
      } else if (this.currentUser) {
        return this.currentUser.photoURL || this.currentUser.profilePic || null;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  updateProfile(data: Account, user?: UserAccountInterface) {
    // this.updatePhoneNumber(data.phone);
    this.userFireStoreDoc.update(data).then((res) => {
      console.log('updated on firebase');
    });
    if (data.email && data.email !== user.email) {
      this.updateEmail(data.email);
    }
    if (data.password) {
      return this.updatePassword(data.password).then((res) => {
        this.login(data);

        return user.updateProfile({
          displayName: data.name,
          photoURL: data.profilePic,
        });
      });
    }

    return user.updateProfile({
      displayName: data.name,
      photoURL: data.profilePic,
    });
  }

  /**
   * Actualiza el nombre a mostrar del usuario y lo sincroniza con su documento.
   */
  async updateDisplayName(name: string) {
    await this.currentUser.updateProfile({
      displayName: name,
      photoURL: this.currentUser.photoURL,
    });

    await this.updateUserData({ name, picture: this.currentUser.photoURL });
  }

  /**
   * Actualiza el correo principal del usuario y lo sincroniza con su documento.
   */
  async updateEmail(email: string) {
    await this.currentUser.updateEmail(email);
    await this.updateUserData({ email });
  }

  updatePassword(password: string) {
    return this.currentUser.updatePassword(password);
  }

  // updatePhoneNumber(phone) {
  //   // let credential = auth.PhoneAuthProvider.credential(this.confirmationResult.verificationId, code);
  //   // return this._user.updatePhoneNumber(credential);
  // }

  /**
   * @deprecated No hace nada
   */
  get myPendingOrdersCount() {
    if (this.authenticated) {
      const total = 0;
      // this.userFireStoreShards.forEach(doc => {
      //   total_count += doc['pendingOrders'];
      // });

      return total;
    } else {
      return 0;
    }
  }

  /**
   * @deprecated No hace nada.
   */
  get myActiveSalesCount() {
    // if (this.authenticated && this.primaryBusiness) {
    //   return this.primaryBusiness.pendingOrders || 0;
    // } else {
    //   return 0;
    // }
    return 0;
  }

  updateReadyState() {
    if (this.isReadyData()) {
      this.readyState.next(true);
    }

    return false;
  }

  isReadyData() {
    if (!this.authenticated) {
      return false;
    }

    return !!this.primaryBusiness;
  }

  /**
   * Agrega o elimina un negocio favorito para el usuario actual.
   */
  async setFavoriteBusiness(businessId: string, isFavorite: boolean) {
    await this.setFavorite('businesses', businessId, isFavorite);
  }

  /**
   * Agrega o elimina al elemento de la colección especificada como favorito para el usuario actual.
   */
  async setFavorite(
    collection: 'businesses' | 'orders' | 'stock',
    id: string,
    isFavorite: boolean
  ): Promise<void> {
    const user = this.currentUserId;

    const data = {
      enabled: isFavorite === true,
    };

    const endpoint = `${this.api.url}/api/users/${user}/favorites/${collection}/${id}`;

    await this.api.http
      .patch(endpoint, {
        data,
      })
      .toPromise();
  }

  /**
   * @deprecated
   */
  onReady(callBack: () => any) {
    return this.readyState.subscribe((ready) => {
      if (ready) {
        callBack();
      }
    });
  }
}
