import { Component, OnInit, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';

import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CustomValidators } from '../../helpers/custom-validators';

declare var swal: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss']
})
export class RegisterComponent implements OnInit {
  // Modal de confirmación
  modalAvisoRef: BsModalRef;

  roles = [
    { value: 'admin', viewValue: 'Admin' },
    { value: 'comprador', viewValue: 'Comprador' },
    { value: 'proveedor', viewValue: 'Proveedor' },
  ];
  registerRoute = '/auth/register';
  showAsModal = false;

  constructor(private authService: AuthService, private router: Router, private modalService: BsModalService, @Optional() public dialogRef: MatDialogRef<RegisterComponent>) { }

  ngOnInit() {
    this.router.url === this.registerRoute ? this.showAsModal = false : this.showAsModal = true
  }

  passwordsMatchValidator(control: FormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }

  userForm = new FormGroup({
    rfc: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.compose([
      Validators.required,
      CustomValidators.patternValidator(/\d/, { hasNumber: true }),
      CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      CustomValidators.patternValidator(/[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\;\'\:\"\|\,\.\<\>]/, { hasSpecialCharacters: true }),
      Validators.minLength(8),
      Validators.maxLength(30)])
    ]),
    repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator]),
    rol: new FormControl(''),
  })

  get rfc(): any { return this.userForm.get('rfc'); }
  get email(): any { return this.userForm.get('email'); }
  get password(): any { return this.userForm.get('password'); }
  get repeatPassword(): any { return this.userForm.get('repeatPassword'); }
  get rol(): any { return this.userForm.get('rol'); }


  register() {

    if (!this.userForm.valid) {
      swal('Campos incompletos o constraseña invalida',
        'Favor de llenar los campos correctamente para continuar.',
        'error');
      return;
    };

    let {
      rfc,
      email,
      password,
      repeatPassword,
      rol
    } = this.userForm.getRawValue();

    this.authService.register(rfc, email, password, repeatPassword, rol)
      .subscribe(data => {
        if (this.showAsModal) {
          this.closeAsModal();
          swal('Usuario creado',
            'Favor de verificar usuario en su correo para dar de alta.',
            'success');
        } else {
          if (data) {
            swal({
              title: 'Usuario creado',
              text: 'Favor de verificar usuario en su correo para dar de alta.',
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
              type: 'success'
            }).then(() => {
              this.router.navigate(['/auth/login'])
            }).catch(() => {
              this.router.navigate(['/auth/login'])
            })
          }
        }
      })
  }

  closeAsModal() {
    this.dialogRef.close();
  }
}
