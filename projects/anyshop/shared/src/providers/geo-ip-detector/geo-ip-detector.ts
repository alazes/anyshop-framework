import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeoIpResponse } from '@anyshop/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class GeoIPDetectorService {
  // url = 'https://ipinfo.io';
  // TODO: TOKEN DETECT COUNTRY
  url = 'https://ipinfo.io?token=ce0fff6bc4bf47';

  private geoIPData?: GeoIpResponse;

  constructor(public http: HttpClient) {
    if (!this.ipData) {
      this.getIPData();
    }
  }

  getIPData(): Observable<GeoIpResponse> {
    const promiseData = this.http.get(this.url) as Observable<GeoIpResponse>;
    const promiseDataSub = promiseData.subscribe(
      (res: GeoIpResponse) => {
        this.geoIPData = res;
        promiseDataSub.unsubscribe();
      },
      (error) => {
        console.error(error);
      }
    );

    return promiseData;
  }

  get ipData() {
    return this.geoIPData;
  }
}
