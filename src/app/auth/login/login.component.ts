import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

declare var swal: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss']
})
export class LoginComponent implements OnInit {
  // Modal de confirmación
  modalAvisoRef: BsModalRef;

  constructor(private authService: AuthService, private router: Router, private modalService: BsModalService) { }

  rfc: string;
  password: string;

  ngOnInit() {
  }

  login(): void {
    if (this.rfc && this.password) {
      this.authService
        .login(this.rfc, this.password)
        .subscribe(data => {
          this.router.navigate(['']);
        })
    } else {
      swal('Campos incompletos',
        'Favor de llenar los campos para continuar.',
        'error');
    }
  }
}
