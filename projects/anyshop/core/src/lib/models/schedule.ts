import { WeekDay } from '@angular/common';

import { Model } from './abstract-model';

class Schedule extends Model {
  _id?: string; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  key?: string;
  business_id: string; // eslint-disable-line  @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  days: WeekDay[];
  from: Date;
  to: Date;
}

export default Schedule;
