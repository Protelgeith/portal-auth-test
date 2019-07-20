import { Component, OnInit, TemplateRef } from '@angular/core';

import { AdminService } from '../services/admin.service';
import { Solicitud } from '../shared/solicitud.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { RolService } from '../services/rol.service';
import { Router } from '@angular/router';

declare var swal;

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: Array<Solicitud>;
  solicitudesCopy: Array<Solicitud>;
  loading: boolean = true;
  // Modal de confirmación
  modalRecRef: BsModalRef;
  traces = [];
  filters = {
    numeroSolicitudDesde: undefined,
    numeroSolicitudHasta: undefined,
    numeroProveedorDesde: undefined,
    numeroProveedorHasta: undefined,
    estado: undefined,
    institucion: undefined,
    fechaCreacionDesde: undefined,
    fechaCreacionHasta: undefined,
    fechaAutorizacionDesde: undefined,
    fechaAutorizacionHasta: undefined,
    creador: undefined
  };
  rol: string;

  constructor(private admin: AdminService, private modalService: BsModalService, private userRol: RolService, private route:Router) { }

  ngOnInit() {
    //this.solicitudes = this.admin.solicitudes;
    this.admin.getSolicitudes()
      .subscribe(solicitudes => {
        console.log(solicitudes);
        setTimeout(() => {
          this.loading = false;
        }, 1000);
        this.solicitudes = solicitudes
        this.solicitudesCopy = solicitudes
      });

    this.rol = this.userRol.getRolByUser()
  }

  showTrace(template: TemplateRef<any>, solicitudKey, modal) {
    let id;
    this.solicitudes[solicitudKey]['status'] == 'Aprobada' ? id = this.solicitudes[solicitudKey]['requestId'] : id = this.solicitudes[solicitudKey]['_id']
    this.admin.getHistoriales(id).subscribe(historial => {
      console.log(historial);
      if (historial) {
        this.traces = historial;
        this.modalRecRef = this.modalService.show(template);
      }
    })
  }

  deleteRequest(rfc) {
    swal({
      title: '¿Desea eliminar esta solicitud?',
      text: 'Aceptar para eliminar',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      type: 'warning'
    }).then(() => {
      this.admin.deleteSolicitud(rfc);
      swal('Solicitud eliminada',
        'Se ha eliminado solicitud correctamente',
        'success').then(()=>{
          this.route.navigate(['/home']);
          setTimeout(() => {
            this.route.navigate(['/solicitudes']);
          }, 100);
        }).catch(()=>{})
    }).catch(() => {
      swal('Operacion cancelada',
        'Se ha cancelado la eliminacion de solicitud',
        'info')
    })
  }

  filterData(test, input) {
    switch (input) {
      case 1:
        this.filters.numeroSolicitudDesde = test.target.value;
        break;
      case 2:
        this.filters.numeroSolicitudHasta = test.target.value;
        break;
      case 3:
        this.filters.numeroProveedorDesde = test.target.value;
        break;
      case 4:
        this.filters.numeroProveedorHasta = test.target.value;
        break;
      case 5:
        this.filters.estado = test.target.value;
        break;
      case 6:
        this.filters.fechaCreacionDesde = new Date(test.target.value).getTime();
        break;
      case 7:
        this.filters.fechaCreacionHasta = new Date(test.target.value).getTime();
        break;
      case 8:
        this.filters.fechaAutorizacionDesde = new Date(test.target.value).getTime();
        break;
      case 9:
        this.filters.fechaAutorizacionHasta = new Date(test.target.value).getTime();
        break;
      case 10:
        this.filters.institucion = test.target.value;
        break;
      case 11:
        this.filters.creador = test.target.value;
        break;
    }
    this.solicitudes = [];
    this.solicitudes = this.solicitudesCopy;

    // 1 y 2
    if (this.filters.numeroSolicitudDesde > -1 && this.filters.numeroSolicitudHasta > -1) {
      this.solicitudes = this.solicitudes.filter((solicitud) => {
        return (this.filters.numeroSolicitudDesde <= solicitud['requestNumber'] && solicitud['requestNumber'] <= this.filters.numeroSolicitudHasta);
      });
    }

    // 3 y 4
    if (this.filters.numeroProveedorDesde > -1 && this.filters.numeroProveedorHasta > -1) {
      this.solicitudes = this.solicitudes.filter((solicitud) => {
        return (this.filters.numeroProveedorDesde <= solicitud['proveedorNumber'] && solicitud['proveedorNumber'] <= this.filters.numeroProveedorHasta);
      });
    }

    // 5
    if (this.filters.estado === 'Solicitada' ||
      this.filters.estado === 'Actualizada' ||
      this.filters.estado === 'Pre Aprobada' ||
      this.filters.estado === 'Aprobada' ||
      this.filters.estado === 'Rechazada') {
      this.solicitudes = this.solicitudes.filter((solicitud) => {
        console.log('estauts');
        return solicitud['status'] === this.filters.estado;
      });
    }

    // 6 y 7 
    if (this.filters.fechaCreacionDesde !== undefined &&
      this.filters.fechaCreacionHasta !== undefined &&
      !isNaN(this.filters.fechaCreacionDesde) &&
      !isNaN(this.filters.fechaCreacionHasta)) {
      this.solicitudes = this.solicitudes.filter((user) => {
        if (user['creation']) {
          let createdDate = new Date(user['creation']['createDate']).getTime();
          return (this.filters.fechaCreacionDesde < createdDate && createdDate < this.filters.fechaCreacionHasta)
        }
      });
    }

    // 8 y 9
    if (this.filters.fechaAutorizacionDesde !== undefined &&
      this.filters.fechaAutorizacionHasta !== undefined &&
      !isNaN(this.filters.fechaAutorizacionDesde) &&
      !isNaN(this.filters.fechaAutorizacionHasta)) {
      this.solicitudes = this.solicitudes.filter((user) => {
        if (user['authorization']) {
          let authDate = new Date(user['authorization']['authDate']).getTime();
          return (this.filters.fechaAutorizacionDesde < authDate && authDate < this.filters.fechaAutorizacionHasta)
        }
      });
    }

    // 10
    if (this.filters.institucion === "ITESM" ||
      this.filters.institucion === "UTM" ||
      this.filters.institucion === "NIC" ||
      this.filters.institucion === "Sorteos" ||
      this.filters.institucion === "Tec Salud (Hospitales)") {
      let solicitudesTemp = this.solicitudes;
      this.solicitudes = [];
      solicitudesTemp.forEach((solicitud, i, solicitudes) => {
        solicitud['institutions'].forEach((institucion) => {
          if (institucion === this.filters.institucion) {
            this.solicitudes.push(solicitudes[i]);
          }
        })
      });
    };
    console.log(this.solicitudes);

    // 11
    /* if (this.filters.creador != '') {
      this.solicitudes = this.solicitudes.filter((solicitud) => {
        if (solicitud['creation']) {
          return this.filters.creador === solicitud['creation']['creator'];
        }
      });
    } */


  }
}

