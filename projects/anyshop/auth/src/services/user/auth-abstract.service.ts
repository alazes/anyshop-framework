import firebase from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  UserRegistrationStatus,
  UserRegistrationStatusData,
} from '../../declarations';
import { UserAccountInterface } from '../../interfaces/user-account.interface';

import { ArxisAuthAbstractInterface } from './auth-abstract.interface';

export interface SyncOptions {
  /**
   * Indica si se incluyen los detalles que necesitan consultar externamente a Firebase
   * (y que por lo tanto podrían exceder las quota de consulta).
   *
   * Por ejemplo, `password`.
   *
   * @deprecated Ahora la contraseña siempre estará disponible
   */
  includeEmailLookups?: boolean;
}

export abstract class ArxisAuthAbstractService
  implements ArxisAuthAbstractInterface<UserAccountInterface>
{
  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  abstract login<TInfo extends { email: string; password: string }>(
    credentials: TInfo
  ): Promise<UserAccountInterface>;

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  abstract signup<TInfo extends { email: string; password: string }>(
    accountInfo: TInfo
  ): Observable<any> | Promise<any>;

  abstract logout(): Observable<any> | Promise<any>;

  protected readonly registrationStatusSubject: BehaviorSubject<UserRegistrationStatus | null>;

  $user: BehaviorSubject<UserAccountInterface | null> =
    new BehaviorSubject<UserAccountInterface | null>(null);

  /**
   * @see registrationStatus
   */
  get registrationStatus$(): Observable<UserRegistrationStatus | null> {
    return this.registrationStatusSubject.asObservable();
  }

  /**
   * Obtiene el estado del registro del usuario autenticado.
   */
  get registrationStatus(): UserRegistrationStatus | null {
    return this.registrationStatusSubject.value;
  }

  /**
   * Obtiene o establece el usuario autenticado actual.
   */
  get currentUser(): UserAccountInterface | null {
    return this.$user.value;
  }

  set currentUser(user: UserAccountInterface | null) {
    this.$user.next(user);

    this.syncRegistrationStatus({ includeEmailLookups: false }); // Actualización asincrónica del registrationStatus$
  }

  constructor() {
    this.registrationStatusSubject =
      new BehaviorSubject<UserRegistrationStatus | null>(null);
  }

  /**
   * Establece el `registrationStatus` (`registrationStatus$`) según el estado del usuario actual.
   *
   * Este método debe llamarse al hacer cambios de credenciales del usuario.
   *
   * Nota: Por defecto se ignora la contraseña y mantendrá el valor actual o undefined.
   * Debe establecerse la opción `includeEmailLookups` a true para incluirla
   *
   * @param options Opciones para la sincronización.
   */
  async syncRegistrationStatus(options?: SyncOptions) {
    if (!options) {
      options = {};
    }
    // TODO: Subscribirse automáticamente a los cambios relacionados para que cambien sin necesidad de llamar este método manualmente.
    const user = this.currentUser;

    if (!user) {
      // console.log(this.constructor.name, null); // 🚧 DEBUG
      this.registrationStatusSubject.next(null);
      return;
    }

    await user.reload();

    const status = this.registrationStatus ?? new UserRegistrationStatus();

    status.email = !!user.email;
    status.name = !!user.displayName;
    status.verifiedEmail = user.emailVerified;
    status.phone = !!user.phoneNumber;

    if (!user.email) {
      // Poner a falso la info que necesita el correo
      status.password = false; // ⚡ Si no tiene correo, entonces sabemos que no tiene contraseña
    } else {
      if (options.includeEmailLookups) {
        // ⚡ No necesita buscar por correo la contraseña
        console.warn(
          'Opción obsoleta: includeEmailLookups. Ahora se busca en el providerData'
        );
        // Si tiene correo entonces se consulta si posee contraseña
        // const methods = await auth().fetchSignInMethodsForEmail(user.email); // 🐛 Como se consulta mucho, viola la quota de búsqueda
        //
        // const password = methods.includes(
        //   auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
        // );
      }

      const password =
        user.providerData.findIndex(
          (info) =>
            info?.providerId ===
            firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
        ) >= 0;

      status.password = password;
    } // Si options.includeEmailLookups es false, entonces los campos que necesiten email van a ser undefined

    // console.log(this.constructor.name, status); // 🚧 DEBUG
    this.registrationStatusSubject.next(status);
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.currentUser?.uid ?? '';
  }
}
