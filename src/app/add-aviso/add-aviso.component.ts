import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { FormsHelperService } from '../services/forms-helper.service';
import { DataService } from '../services/data.service';
import { AdminService } from '../services/admin.service';

declare var swal: any;

@Component({
  selector: 'app-add-aviso',
  templateUrl: './add-aviso.component.html',
  styleUrls: ['./add-aviso.component.scss']
})
export class AddAvisoComponent implements OnInit {
  // Modal de confirmación
  modalAvisoRef: BsModalRef;

  // Para (des)seleccionar todas las instituciones
  selectInstituciones: boolean = false;

  // Arreglos con valores disponibles para campos a seleccionar
  todasInstituciones: Array<string>;

  avisoForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    start: [undefined, Validators.required],
    end: [undefined, Validators.required],
    instituciones: this.fb.array([], this.fh.minSelectedCheckboxes(1)),
  })

  // Getter para FormArray de instituciones
  get instituciones() {
  	return this.avisoForm.get('instituciones') as FormArray;
  }

  constructor(private fb: FormBuilder, 
              private fh: FormsHelperService, 
              private modalService: BsModalService,
              private data: DataService,
              private admin: AdminService) { }

  ngOnInit() {
    // Obtiene datos para instituciones
    this.todasInstituciones = this.data.instituciones;

    // Agrega FormControl por cada institución
  	for(var i=0; i<this.todasInstituciones.length; i++){
  		this.instituciones.push(this.fb.control(false));
  	}
  }

  // Se seleccionan o deseleccionan todas las instituciones
  selectAllInstituciones() {
  	// Valor opuesto al que se tenía
  	this.selectInstituciones = ! this.selectInstituciones;
  	// FormHelper se encarga de la operación
  	this.fh.selectAllCheckboxes(this.instituciones, this.selectInstituciones);
  }

  // Regresa arreglo con las instituciones elegidas
  getInstitucionesStrings(): string[] {
  	var s = new Array<string>();
  	for(var i=0; i<this.todasInstituciones.length; i++){
  		if(this.instituciones.controls[i].value)
  			s.push(this.todasInstituciones[i]);
  	}

  	return s;
  }

  // Muestra el modal
  showModal(template: TemplateRef<any>) {
  	this.modalAvisoRef = this.modalService.show(template);
  }

  // Se envía aviso para ser registrado
  enviarAviso(template) {
    // Valida campos
    if(this.avisoForm.valid) {
      // Campos válidos

      var av = this.avisoForm.value;
      av.instituciones = this.getInstitucionesStrings();
      
      // Envía y muestra modal
      this.admin.postNotification(av)
        .subscribe(result=>{
          if(result)
            this.showModal(template);
			  });
      
    } else {
      // Muestra mensajes de validación
  		this.fh.validateAllFormFields(this.avisoForm);
  		// Campos inválidos, no se envía
      swal('Datos incompletos', 
        'Favor de llenar los campos necesarios de manera correcta para continuar.', 
        'error');
    }
  }

}
