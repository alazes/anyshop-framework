import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  cfaSignInPhone,
  cfaSignInPhoneOnCodeSent,
} from 'capacitor-firebase-auth';
import {
  PhoneSignInResult,
  cfaSignInPhone as cfaSignInPhoneAlternative,
} from 'capacitor-firebase-auth/alternative';
import firebase from 'firebase/app';
import * as _ from 'lodash';

import { ArxisDeviceService } from '../device/device';

import { ArxisSmsAuthInterface } from './sms-auth.interface';
// import {SignInResult} from './definitions';

@Injectable()
export class ArxisSmsAuthService implements ArxisSmsAuthInterface {
  verificationId: string | undefined;
  confirmationResult: any;
  recaptchaVerifier: firebase.auth.RecaptchaVerifier | undefined;

  constructor(
    public afAuth: AngularFireAuth,
    public platform: ArxisDeviceService
  ) {}

  async sendSMSVerification(
    phone: string,
    verifier?: firebase.auth.RecaptchaVerifier
  ): Promise<string> {
    if (await this.platform.is('android')) {
      const seq: Promise<string> = new Promise((resolve, reject) => {
        cfaSignInPhone(phone).subscribe(
          () => {},
          (error) => {
            console.log('error on cfaSignInPhone', error);
            reject(error);
          }
        );

        cfaSignInPhoneOnCodeSent().subscribe(
          (verificationId) => {
            this.verificationId = verificationId;
            resolve(verificationId);
          },
          (error) => {
            // TODO: Registrar eventos de error
            console.log('error cfaSignInPhoneOnCodeSent', error);
            reject(error);
          }
        );
      });

      return seq;
    } else if (await this.platform.is('ios')) {
      const seq = new Promise((resolve, reject) => {
        this.platform
          .hasPermissionNotifications()
          .then((data) => {
            // this.firebasePlugin.logEvent('userHasPermissionIOS', {
            //   isEnabled: data.isEnabled || 'no data'
            // });
            console.log('data', data);

            if (data !== 'granted') {
              this.platform.requestPushNotifications().then((value) => {
                // this.firebasePlugin.logEvent('userRequestPermissionIOS', {
                //   value
                // });
                this.sendSMSVerificationIOS(phone)
                  .then((verificationId) => {
                    this.verificationId = verificationId;
                    resolve(verificationId);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              });
            } else {
              this.sendSMSVerificationIOS(phone)
                .then((verificationId) => {
                  resolve(verificationId);
                })
                .catch((error) => {
                  reject(error);
                });
            }
          })
          .catch((error) => {
            reject(error);
          });
      });

      return seq as Promise<string>;
    } else {
      this.recaptchaVerifier = verifier;

      if (!this.recaptchaVerifier) {
        throw new Error('No recaptchaVerifier');
      }

      const seq = this.afAuth
        .signInWithPhoneNumber(phone, this.recaptchaVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          this.confirmationResult = confirmationResult;
          this.verificationId = confirmationResult.verificationId;

          return this.verificationId;
        });

      seq.catch((error) => {
        // Error; SMS not sent
        // ...
        console.error('ERROR', error);

        return error;
      });

      return seq;
    }
  }

  sendSMSVerificationAndroidAlternative(
    phone: string,
    verifier?: firebase.auth.RecaptchaVerifier
  ): Promise<firebase.auth.UserCredential> {
    const seq: Promise<firebase.auth.UserCredential> = new Promise(
      (resolve, reject) => {
        cfaSignInPhoneAlternative(phone).subscribe(
          ({
            userCredential,
            result,
          }: {
            userCredential: firebase.auth.UserCredential;
            result: PhoneSignInResult;
          }) => {
            resolve(userCredential);
          },
          (error) => {
            console.log('error on cfaSignInPhone', error);
            reject(error);
          }
        );
      }
    );

    return seq;
  }

  sendSMSVerificationIOS(phone: string): Promise<string> {
    const seq: Promise<string> = new Promise((resolve, reject) => {
      cfaSignInPhone(phone).subscribe(
        () => {},
        (error) => {
          console.log('error on cfaSignInPhone', error);
          reject(error);
        }
      );

      cfaSignInPhoneOnCodeSent().subscribe(
        (verificationId) => {
          this.verificationId = verificationId;
          resolve(verificationId);
        },
        (error) => {
          // TODO: Registrar eventos de error
          console.log('error on phone code sent', error);
          reject(error);
        }
      );
    });

    return seq;
  }

  confirm(
    code: string,
    verificationId?: string
  ): Promise<firebase.auth.AuthCredential> {
    const confirmedPromise: Promise<firebase.auth.AuthCredential> = new Promise(
      (resolve, reject) => {
        if (!code) {
          reject(new Error('Parece que te olvidaste de escribir el código'));
        }

        if (!verificationId) {
          verificationId = this.verificationId;
        }
        if (!verificationId) {
          return reject(new Error('No verficationId!'));
        }

        const phoneCredential = firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          code
        );

        resolve(phoneCredential);
      }
    );

    return confirmedPromise;
  }
}
