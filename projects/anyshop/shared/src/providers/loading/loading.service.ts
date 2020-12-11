import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'any' })
export class LoadingService {
  private messages: string[] = [];
  loading: any;

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translateService: TranslateService
  ) {
    const loginErrors = [
      'auth/user-disabled',
      'auth/invalid-email',
      'auth/user-not-found',
      'auth/wrong-password',
      'auth/network-request-failed',
      'auth/account-exists-with-different-credential',
      'auth/email-already-in-use',
      'auth/operation-not-allowed',
      'auth/weak-password',
      'auth/invalid-verification-code',
      'auth/code-expired',
      'auth/credential-already-in-use',
      'auth/too-many-requests',
      'auth/requires-recent-login',
    ];
    const defaultMessages = ['WAIT_PLEASE'];
    this.translateService
      .get(defaultMessages.concat(loginErrors))
      .subscribe((values) => {
        this.messages = values;
      });
  }

  async showLoading(messageOrCode?: string) {
    let message: string = this.messages['WAIT_PLEASE']; // tslint:disable-line no-string-literal

    if (messageOrCode) {
      message = await this.translateService.get(messageOrCode).toPromise();
      // console.log(message);
    }

    this.loading = await this.loadingCtrl.create({
      message,
    });

    return await this.loading.present();
  }

  async dimissLoading() {
    return await this.loadingCtrl.dismiss();
  }

  async showAlert(
    message: string,
    position?: 'top' | 'bottom' | 'middle',
    duration?: number
  ) {
    message = await this.translateService.get(message).toPromise();

    const toast = await this.toastCtrl.create({
      message,
      duration: duration || 3000,
      position: position || 'bottom',
    });

    await toast.present();
  }

  async showError(
    errorCode?: string,
    onErrorUnkwonMessage?: string,
    position?: 'top' | 'bottom' | 'middle',
    duration?: number
  ) {
    let message = this.messages[errorCode];

    if (!message) {
      message = await this.translateService
        .get(onErrorUnkwonMessage)
        .toPromise();
    }

    const toast = await this.toastCtrl.create({
      message,
      duration: duration || 3000,
      position: position || 'top',
    });

    await toast.present();
  }
}
