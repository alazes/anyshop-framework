import { Injectable } from '@angular/core';
import { PermissionState } from '@capacitor/core';
import { Device, DeviceInfo } from '@capacitor/device';
import { PushNotifications } from '@capacitor/push-notifications';

// const { Permissions } = Plugins;

@Injectable({ providedIn: 'root' })
export class ArxisDeviceService {
  info: DeviceInfo | undefined;
  constructor() {}

  async getInfo() {
    if (!this.info) {
      this.info = await Device.getInfo();
    }

    return this.info;
  }

  async is(type: 'ios' | 'android' | 'electron' | 'web') {
    return (await this.getInfo()).platform === type;
  }

  async requestPushNotifications() {
    return await PushNotifications.requestPermissions();
  }

  async hasPermissionNotifications(): Promise<PermissionState> {
    const status = await PushNotifications.checkPermissions();

    return status.receive;
  }
}
