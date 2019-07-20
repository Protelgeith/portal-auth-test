import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { RegisterComponent } from '../auth/register/register.component';
import { AdminService } from '../services/admin.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { string, object } from 'prop-types';

export interface DialogData {
  name: string;
  password: string;
}

declare var swal: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  modalRecRef: BsModalRef;
  loading: boolean = true;
  traces = [];
  users: string[] = [];
  usersCopy: string[] = [];
  filters = {
    rol: '',
    activeUser: '',
    date: undefined,
    date2: undefined,
    // permisos: 
  };
  user = {
    form: {},
    id: '',
  }
  userId: string;
  counter: number = 0;

  constructor(public dialog: MatDialog, private admin: AdminService, private modalService: BsModalService) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  ngOnInit() {
    this.admin.getVendors().subscribe((users) => {
      for (const key in users) {
        if (users.hasOwnProperty(key)) {
          const user = users[key];
          this.users.push(user)
          this.usersCopy.push(user)
        }
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    })
  }

  onNoClick(): void {
    // this.dialogRef.close();
  }

  enableEdit(id) {
    this.counter++;
    if (this.counter === 1) {
      swal({
        title: '¿Desea editar usuario?',
        text: 'Al finalizar la edicion, <br> favor de seleccionar boton para guardar cambios.',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then((accept) => {
        this.userId = id;
      }).catch((err) => {
      })
    }
    if (this.counter === 2) {
      swal({
        title: '¿Desea guardar cambios?',
        text: 'Aceptar para continuar',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then((accept) => {
        this.counter = 0;
        this.userId = '';
        this.saveEditUser();
      }).catch((err) => {
      })
    }
  }

  enableEditRow(user) {
    if (user._id == this.userId) {
      return false;
    } else {
      return true;
    }
  }

  updateActiveUser(event, id, userPos) {
    let permisos = this.user.form['permisos'] || this.users[userPos]['permissions'];
    let rol = this.users[userPos]['rol'];
    this.user.id = id;
    this.user.form['activeUser'] = event.checked;
    this.user.form['permisos'] = permisos;
    this.user.form['rol'] = rol;
  }

  updatePermissions(event, id, userPos, i, j, k) {
    this.users[userPos]['permissions'][i][j][k] = event.checked;
    let rol = this.users[userPos]['rol'];
    let activeUser = this.users[userPos]['activeUser'];
    let permisos = this.users[userPos]['permissions'];
    this.user.id = id;
    this.user.form['activeUser'] = activeUser;
    this.user.form['permisos'] = permisos;
    this.user.form['rol'] = rol;
  }

  saveEditUser() {
    console.log(this.user.id, this.user.form);
    if (this.user.id.length > 0) {
      this.admin.updateRolByUser(this.user.id, this.user.form).subscribe((res) => {
        swal('Actualizado!',
          'Se ha actualizado correctamente.',
          'info');
      });
    } else {
      swal('Actualizado!',
        'Se ha actualizado correctamente.',
        'info');
    }
  }

  showTrace(template: TemplateRef<any>, userPos) {
    let id;
    id = this.users[userPos]['_id'];
    this.admin.getHistoriales(id).subscribe(historial => {
      if (historial) {
        this.traces = historial;
        this.modalRecRef = this.modalService.show(template);
      }
    })
  }

  filterData(test, input) {
    switch (input) {
      case 1:
        this.filters.rol = test.target.value;
        break;
      case 2:
        this.filters.activeUser = test.target.value;
        break;
      case 3:
        let inputDate01 = test.target.value;
        let newDate01 = new Date(inputDate01).getTime();
        this.filters.date = newDate01;
        break;
      case 4:
        let inputDate02 = test.target.value;
        let newDate02 = new Date(inputDate02).getTime();
        this.filters.date2 = newDate02;
        break;
    }
    this.users = [];
    this.users = this.usersCopy;

    if (this.filters.rol === 'proveedor' ||
      this.filters.rol === 'comprador' ||
      this.filters.rol === 'admin') {
      this.users = this.users.filter((user) => {
        return user['rol'] === this.filters.rol;
      });
    }
    if (this.filters.activeUser === "si" || this.filters.activeUser === "no") {
      this.users = this.users.filter((user) => {
        let res;
        user['activeUser'] ? res = 'si' : res = 'no';
        return res == this.filters.activeUser;
      });
    }
    if (this.filters.date !== undefined && this.filters.date2 !== undefined && !isNaN(this.filters.date) && !isNaN(this.filters.date2)) {
      this.users = this.users.filter((user) => {
        let createdDate = user['createdAt'];
        let newDate03 = new Date(createdDate).getTime();
        return (this.filters.date < newDate03 && newDate03 < this.filters.date2)
      });
    }
  }

}
