import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';


import { TokenStorage } from './token.storage';
import { TooltipComponent } from '@angular/material';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private token: TokenStorage) { }

  public $userSource = new Subject<any>();

  login(rfc: string, password: string): Observable<any> {
    return Observable.create(observer => {
      this.http.post('http://localhost:4040/api/auth/login', {
        rfc,
        password
      }).subscribe((data: any) => {
        observer.next({ user: data.user });
        this.setUser(data.user);
        this.token.saveToken(data.token);
        observer.complete();
      })
    });
  }

  register(rfc: string, email: string, password: string, repeatPassword: string, rol: string): Observable<any> {
    return Observable.create(observer => {
      this.http.post('http://localhost:4040/api/auth/register', {
        rfc,
        email,
        password,
        repeatPassword,
        rol
      }).subscribe((data: any) => {
        observer.next({ user: data });
        this.setUser(data.user);
        this.token.saveToken(data.token);
        observer.complete();
      })
    });
  }

  registerProviderVipUser(rfc: string) {
    return this.http.post('http://localhost:4040/api/auth/registerUser', { rfc })
  }

  setUser(user): void {
    if (user) user.isAdmin = (user.roles.indexOf('admin') > -1);
    this.$userSource.next(user);
    (<any>window).user = user;
  }

  getUser(): Observable<any> {
    return this.$userSource.asObservable();
  }

  me(): Observable<any> {
    return Observable.create(observer => {
      const tokenVal = this.token.getToken();
      if (!tokenVal) return observer.complete();
      this.http.get('/api/auth/me').subscribe((data: any) => {
        observer.next({ user: data.user });
        this.setUser(data.user);
        observer.complete();
      })
    });
  }

  signOut(): void {
    this.token.signOut();
    this.setUser(null);
    delete (<any>window).user;
  }

  getEmail(email): Observable<any> {
    return this.http.get('http://localhost:4040/api/auth/reset-password/' + email)
  }

  authUser(id) {
    return this.http.get('http://localhost:4040/api/auth/confirm-account/' + id)
  }

  postNewPassword(token, password) {
    return this.http.post('http://localhost:4040/api/auth/reset-password/' + token, { password })
  }
}
