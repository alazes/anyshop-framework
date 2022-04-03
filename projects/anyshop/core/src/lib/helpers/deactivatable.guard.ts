import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { IDeactivatablePage } from './deactivatable-page';

/**
 * Usa la interfaz IDeactivatablePage, implementada en una página para determinar si se puede o no salir de la página.
 *
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
@Injectable({
  providedIn: 'root',
})
export class DeactivatablePageGuard
  implements CanDeactivate<IDeactivatablePage>
{
  async canDeactivate(
    component: IDeactivatablePage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    return await component.canExit(currentRoute, currentState, nextState);
  }
}
