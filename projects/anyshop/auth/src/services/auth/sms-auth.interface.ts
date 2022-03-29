import firebase from 'firebase/app';

export interface ArxisSmsAuthInterface {
  verificationId: string | undefined;
  confirmationResult: any;
  recaptchaVerifier: any;

  sendSMSVerification(
    phone: string,
    verifier?: firebase.auth.RecaptchaVerifier
  ): Promise<string>;

  sendSMSVerificationIOS(phone: string): Promise<string>;

  confirm(
    code: string,
    verificationId: string
  ): Promise<firebase.auth.AuthCredential>;
}
