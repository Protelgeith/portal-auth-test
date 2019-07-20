import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { ErrorHandler } from './error_handler';
import { HttpErrTypes } from '../enums/http-err-types.enum';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
    public errorHandler: ErrorHandler,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).do((event: HttpEvent<any>) => { }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.error.response) {
          if (err.error.response.includes('jwt expired')) {
            return this.errorHandler.handleError(HttpErrTypes.change_pass_jwt_expired)
          }
          if (err.error.response.includes('invalid signature')) {
            return this.errorHandler.handleError(HttpErrTypes.change_pass_invalid_token)
          }
        }

        if (err.error.errors) {
          if (err.error.errors['user.email']) {
            if (err.error.errors['user.email'].message.includes('Proveedor ya tiene una solicitud activa')) {
              return this.errorHandler.handleError(HttpErrTypes.active_register);
            }
          } else if (err.error.errors['fiscalData.rfc']) {
            if (err.error.errors['fiscalData.rfc'].message.includes('El RFC ya esta registrado')) {
              return this.errorHandler.handleError(HttpErrTypes.duplicate_preregister);
            }
          }
        }
        if (err.error === 'Unauthorized') {
          return this.errorHandler.handleError(HttpErrTypes.unauthorized);
        }
        if (err.error === 'Duplicate preregister') {
          return this.errorHandler.handleError(HttpErrTypes.duplicate_preregister);
        }
        if (err.error.errmsg) {
          if (err.error.errmsg.includes('E11000 duplicate key error collection: test.User')) {
            return this.errorHandler.handleError(HttpErrTypes.duplicate_user)
          }
        }
        if (err.error.error.includes('Contactar al administrador')) {
          return this.errorHandler.handleError(HttpErrTypes.inactive_user)
        }
      }
    });
  }
}