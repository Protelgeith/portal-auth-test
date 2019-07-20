import { Injectable } from '@angular/core';
import { TokenStorage } from '../auth/token.storage';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(public token: TokenStorage) { }

  getRolByUser() {
    const token = this.token.getToken();
    if (token) {
      const tokenPayload = decode(token);
      let rol = tokenPayload.rol;
      rol === '' ? rol = 'proveedor' : rol
      return rol
    }
  }

  isProviderVip() {
    const token = this.token.getToken();
    if (token) {
      const tokenPayload = decode(token);
      const providerVip = tokenPayload.fullForm;
      return providerVip
    }
  }

  getRFC() {
    const token = this.token.getToken();
    if (token) {
      const tokenPayload = decode(token);
      const rfc = tokenPayload.rfc;
      return rfc
    }
  }

  getEmail() {
    const token = this.token.getToken();
    if (token) {
      const tokenPayload = decode(token);
      const email = tokenPayload.email;
      return email
    }
  }

  expTime() {
    const token = this.token.getToken();
    if (token) {
      const tokenPayload = decode(token);
      const exp = tokenPayload.expTime;
      return (exp * 60 * 1000); // MIN * SEG * MILIS
    }
  }
}
