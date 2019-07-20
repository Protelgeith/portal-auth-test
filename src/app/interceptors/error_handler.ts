import { Injectable, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HttpErrTypes } from '../enums/http-err-types.enum';

declare var swal: any;

@Injectable()
export class ErrorHandler {
  // Modal de confirmación
  modalAvisoRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  public handleError(typeErr: HttpErrTypes) {
    switch (typeErr) {

      case HttpErrTypes.unauthorized:
        swal({
          title: 'Credenciales erroneas',
          text: 'Favor de llenar usuario y contraseña de manera correcta para continuar.',
          type: 'error',
          showCloseButton: true
        });
        break;

      case HttpErrTypes.duplicate_user:
        swal({
          title: 'Este usuario ya existe',
          text: 'Favor de llenar usuario y contraseña de manera correcta para continuar.',
          type: 'error',
          showCloseButton: true
        });
        break;

      case HttpErrTypes.duplicate_preregister:
        swal({
          title: 'Solicitud no actualizada',
          text: 'Este RFC ó e-mail ya existe',
          type: 'error',
          showCloseButton: true
        })
        break;

      case HttpErrTypes.active_register:
        swal({
          title: 'Solicitud no creada',
          text: 'El usuario ya tiene una solicitud activa',
          type: 'error',
          showCloseButton: true
        })
        break;

      case HttpErrTypes.inactive_user:
        swal({
          title: 'Error de acceso',
          text: 'El usuario tiene su cuenta inactiva, porfavor contacte a su administrador',
          type: 'error',
          showCloseButton: true
        })
        break;

      case HttpErrTypes.change_pass_jwt_expired:
        swal({
          title: 'Error de cambio de contraseña',
          text: 'Esta solicitud en cambio de contraseña ha expirado',
          type: 'error',
          showCloseButton: true
        })
        break;

      case HttpErrTypes.change_pass_invalid_token:
        swal({
          title: 'Error de cambio de contraseña',
          text: 'Este token no existe',
          type: 'error',
          showCloseButton: true
        })
        break;

      default:
        break;
    }
  }
}