import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, NavigationEnd, NavigationStart, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenStorage } from './token.storage';
import decode from 'jwt-decode';
import { filter } from 'rxjs/operators';
declare var swal: any;

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(public auth: AuthService, public router: Router, private token: TokenStorage) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    return new Promise((resolve, reject) => {
      const token = this.token.getToken();
      const tokenPayload = decode(token);
      if (!token) {
        this.router.navigate(['/auth/login']);
      }
      // decode the token to get its payload



      if (state.url.indexOf('registro') > -1) {
        if (tokenPayload.rol.indexOf('proveedor') > -1) {
          this.router.navigate(['/home']);
          resolve(false);
        }
        else {
          resolve(true)
        }
      }
      else if (state.url.indexOf('solicitudes') > -1) {
        if (tokenPayload.rol.indexOf('proveedor') > -1) {
          this.router.navigate(['/home']);
          resolve(false)
        }
        else {
          resolve(true)
        }
      }
      else if (state.url.indexOf('roles') > -1 || state.url.indexOf('add-aviso') > -1 || state.url.indexOf('configuracion') > -1) {
        if (tokenPayload.rol.indexOf('admin') > -1) {
          resolve(true)
        }
        else {
          this.router.navigate(['/home']);
          resolve(false)
        }
      }
    })
  }
}
