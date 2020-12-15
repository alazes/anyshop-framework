import { Model } from './abstract-model';

class DeliveryMethod extends Model {
  _id: string; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  name: string;
  key?: string;
  default_price: number; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  owner: string;
  radio: number;
  geolocation: any;
  price_zones?: any; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  polygon_area?: any; // eslint-disable-line  @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
}

export default DeliveryMethod;
