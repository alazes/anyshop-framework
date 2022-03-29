import { BehaviorSubject, Observable } from 'rxjs';

export interface ArxisAuthAbstractInterface<T> {
  $user: BehaviorSubject<T | null>;

  currentUser: T | null;
  // Returns true if user is logged in
  authenticated: boolean;
  // Returns current user UID
  currentUserId: string;

  login<TInfo extends { email: string; password: string }>(
    credentials: TInfo
  ): Promise<any>;

  logout(): Observable<any> | Promise<any>;

  signup(credentials: {
    [key: string]: any;
    email: string;
    password: string;
  }): Observable<any> | Promise<any>;
}
