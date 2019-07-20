import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { CustomValidators } from '../../helpers/custom-validators';


declare var swal: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../auth.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  email: string;

  showPasswordField = false;

  ngOnInit() {
    if (this.router.url.includes('/reset-password/')) {
      this.showPasswordField = true
    }
  }

  passwordsMatchValidator(control: FormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }

  userForm = new FormGroup({
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
  })

  get password(): any { return this.userForm.get('password'); }
  get repeatPassword(): any { return this.userForm.get('repeatPassword'); }

  sendEmail() {
    this.authService.getEmail(this.email).subscribe((res) => {
      if (res) {
        swal({
          title: 'Estimado usuario',
          text: 'En breve se le enviara un correo, el cual debe aceptar para confirmar el cambio de contraseña.',
          type: 'success',
          showCloseButton: true
        }).then((ok) => {
          if (ok) {
            this.router.navigate(['/login']);
          }
        }).catch((err) => { })
      } else {

      }
    })
  }

  changePassword() {
    console.log(this.userForm);
    if (this.userForm.valid) {
      let token = this.route.params['_value'].id
      let password = this.userForm.controls['password'].value
      this.authService.postNewPassword(token, password).subscribe((res) => {
        swal({
          title: 'Contraseña actualizada',
          html: 'En breve seras redireccionado al login.',
          timer: 3000,
          type: 'success',
          onOpen: () => {
            swal.showLoading()
          },
          onClose: () => {
            this.router.navigate(['../auth/login'])
          }
        }).then((result) => {

        }).catch((err) => {

        })
      })
    }
  }
}
