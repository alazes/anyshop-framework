import firebase from 'firebase/app';

import { Roles } from './roles';

export interface UserAccountInterface extends firebase.User {
  name: string | null;
  password?: string;
  profilePic?: string;
  phone: string | null;
  type?: string;
  roles?: Roles;
}
