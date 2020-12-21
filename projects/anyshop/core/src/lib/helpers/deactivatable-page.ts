import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

/**
 * Expone un método para determinar si se puede salir de la página, necesario para aplicar el guard DeactivatablePageGuard a una página.
 *
 * Para ser implementado en un componente de página.
 *
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
export interface IDeactivatablePage {
  /**
   * Indica si se puede o no salir de la página, o si se debe redirigir.
   */
  canExit(
    currentRoute?: ActivatedRouteSnapshot,
    currentState?: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Promise<boolean | UrlTree>;
}
