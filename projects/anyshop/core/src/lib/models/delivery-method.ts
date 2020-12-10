import { Model } from './abstract-model';

class DeliveryMethod extends Model {
  _id: string; // tslint:disable-line variable-name
  name: string;
  key?: string;
  default_price: number; // tslint:disable-line variable-name
  owner: string;
  radio: number;
  geolocation: any;
  price_zones?: any; // tslint:disable-line variable-name
  polygon_area?: any; // tslint:disable-line variable-name
}

export default DeliveryMethod;
