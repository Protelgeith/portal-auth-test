import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorage } from './token.storage';
import * as decode from 'jwt-decode';
declare var swal: any;

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public router: Router, private token: TokenStorage) { }

  canActivate() {
    const user = this.token.getToken();
    const decoded = decode(user);

    if (user) {
      return true;
    }
    else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/auth/login']);
      return false;
    }

  }

}
