import { WeekDay } from '@angular/common';

import { Model } from './abstract-model';

class Schedule extends Model {
  _id?: string; // tslint:disable-line variable-name
  key?: string;
  business_id: string; // tslint:disable-line variable-name
  days: WeekDay[];
  from: Date;
  to: Date;
}

export default Schedule;
