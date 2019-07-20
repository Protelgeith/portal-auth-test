import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AuthService } from '../auth/auth.service';

declare var swal;

@Component({
  selector: 'app-generate-quick-provider-modal',
  templateUrl: './generate-quick-provider-modal.component.html',
  styleUrls: ['./generate-quick-provider-modal.component.scss']
})
export class GenerateQuickProviderModalComponent implements OnInit {

  rfc: string;

  constructor(public auth: AuthService, @Optional() public dialogRef: MatDialogRef<GenerateQuickProviderModalComponent>) { }

  ngOnInit() {
  }

  createUser() {
    this.auth.registerProviderVipUser(this.rfc).subscribe((res) => {
      if (res) {
        this.closeAsModal();
        swal({
          title: 'Usuario generado!',
          text: 'RFC: <b>' + res['rfc'] + '</b><br>' + 'Password: <b>' + res['password']+ '</b>',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          type: 'success'
        }).then((accept) => {
        }).catch((err) => {
        })
      }
    })
  }

  closeAsModal() {
    this.dialogRef.close();
  }

}
