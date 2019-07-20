import { Component, OnInit, TemplateRef } from '@angular/core';

import { AdminService } from '../services/admin.service';
import { Solicitud } from '../shared/solicitud.model';
import { TokenStorage } from '../auth/token.storage';
import decode from 'jwt-decode';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {
  solicitudes = [];
  loading = true;
  modalRecRef: BsModalRef;
  traces = [];

  constructor(private admin: AdminService, private token: TokenStorage, private modalService: BsModalService) { }

  ngOnInit() {
    //this.solicitudes = this.admin.solicitudes;
    const token = this.token.getToken();
    const tokenPayload = decode(token);
    this.admin.getMySolicitudes(tokenPayload.rfc)
      .subscribe(solicitudes => {
        if (solicitudes) {
          this.loading = false;
          this.solicitudes = solicitudes;
        }
      });
  }

  showTrace(template: TemplateRef<any>, solicitudKey) {
    let id;
    this.solicitudes[solicitudKey]['status'] == 'Aprobada' ? id =this.solicitudes[solicitudKey]['requestId'] : id = this.solicitudes[solicitudKey]['_id']
      this.admin.getHistoriales(id).subscribe(historial => {
        console.log(historial);
        if (historial) {
          this.traces = historial;
          this.modalRecRef = this.modalService.show(template);
        }
      })
  }



}
