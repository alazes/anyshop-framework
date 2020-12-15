import { firestore } from 'firebase/app';

import { Model } from './abstract-model';

class Address extends Model {
  alias: string;
  country: string;
  address: string;
  addressSystem: any;
  street?: string;
  city: string;
  district: string;
  geolocation: firestore.GeoPoint;
  key: string;
  number: string; // eslint-disable-line id-blacklist
  owner: any;
  icon: any;
  type: any;
  reference: string;
}

export default Address;
