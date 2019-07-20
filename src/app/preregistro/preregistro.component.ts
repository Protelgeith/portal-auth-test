import { Component, OnInit, TemplateRef } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	FormArray,
	Validators
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DataService } from '../services/data.service';
import { ProfileService } from '../services/profile.service';
import { FormsHelperService } from '../services/forms-helper.service';
import { EventService } from '../services/event.service';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { RolService } from '../services/rol.service';


declare var swal: any;

@Component({
	selector: 'preregistro',
	templateUrl: './preregistro.component.html',
	styleUrls: ['./preregistro.component.scss']
})
export class PreregistroComponent implements OnInit {
	// Modal de confirmación
	modalRecRef: BsModalRef;

	terminos: boolean = false;
	politicaPriv: boolean = false;
	typeModal: number;
	esPersonaFisica: boolean = false;
	esPersonaMoral: boolean = false;

	// Rol 
	solicitudRouteByRol: string;
	providerVip: boolean;

	cancelarPreregistro: boolean = false;

	// Para (des)seleccionar todas las instituciones
	selectInstituciones: boolean = false;

	// Arreglos con valores disponibles para campos a seleccionar
	todasInstituciones: Array<string>;
	insumos: Array<string>;
	giros: Array<string>;
	paises: Array<string>;
	regiones: Array<string>;

	// PreRegistro FormGroup
	preregistroForm = this.fb.group({

		// Instituciones
		instituciones: this.fb.array([
		], this.fh.minSelectedCheckboxes(1)),

		// Datos Fiscales
		datosFiscales: this.fb.group({
			tipoPersona: [undefined, Validators.required],
			rfc: ['', Validators.required],
			curp: [''],
			insumo: [undefined, Validators.required],//['', Validators.required],
			giro: [undefined],
			nombre: ['', Validators.required],
			apellidoP: [''],
			apellidoM: [''],
			calle: ['', Validators.required],
			numero: [''],
			colonia: [''],
			codigoPostal: ['', Validators.required],
			poblacion: ['', Validators.required],
			pais: ['', Validators.required],
			region: ['', Validators.required]
		}),

		// Datos Ventas
		datosVentas: this.fb.group({
			nombreContacto: [''],
			telMovil: [''],
			telFijo: [''],
			ext: [''],
			telFijo2: [''],
			ext2: [''],
			fax: [''],
			extFax: [''],
			email: ['', [Validators.required, Validators.email]],
			pagina: [''],
			empleadoDueno: [''],
			exatec: ['']
		}),

		datosBanco: this.fb.group({
			paisBanco: [''],
			banco: [''],
			clabe: [''],
			titularCuenta: [''],
			claveControl: [''],
			moneda: [''],
			contactoCobranza: [''],
			telefono: [''],
			email: [''],
		}),

		comentarios: this.fb.group({
			comentarios: [''],
			terminos: [false],
			politicaPriv: [false]
		}),
	});

	// Getter para FormArray de instituciones
	get instituciones() {
		return this.preregistroForm.get('instituciones') as FormArray;
	}

	// Getter para FormGroup de datosFiscales
	get datosFiscales() {
		return this.preregistroForm.get('datosFiscales') as FormGroup;
	}

	get datosVentas() {
		return this.preregistroForm.get('datosVentas') as FormGroup;
	}

	get datosBanco() {
		return this.preregistroForm.get('datosBanco') as FormGroup;
	}

	get comentarios() {
		return this.preregistroForm.get('comentarios') as FormGroup;
	}

	constructor(
		private modalService: BsModalService,
		private fb: FormBuilder,
		private data: DataService,
		private profile: ProfileService,
		private admin: AdminService,
		private fh: FormsHelperService,
		private event: EventService,
		private userRol: RolService,
		public router: Router,
	) { }

	ngOnInit() {
		this.setFeaturesByRol();

		// Cambia el título de la página
		this.event.titleChange("Pre-registro de proveedor");

		// Obtiene los datos para campos donde se elige
		this.todasInstituciones = this.data.instituciones;
		this.insumos = this.data.insumos;
		this.giros = this.data.giros;
		this.paises = this.data.paises;
		this.regiones = this.data.regiones;

		// Agrega FormControl por cada institución
		for (var i = 0; i < this.todasInstituciones.length; i++) {
			this.instituciones.push(this.fb.control(false));
		}
	}

	setFeaturesByRol() {
		let rol = this.userRol.getRolByUser();
		switch (rol) {
			case 'admin':
				this.solicitudRouteByRol = '/solicitudes'
				break;

			case 'comprador':
				this.solicitudRouteByRol = '/solicitudes'
				break;

			case 'proveedor':
				if (this.userRol.isProviderVip()) {
					this.providerVip = true;
				} else {
					this.providerVip = false;
				}
				this.solicitudRouteByRol = '/solicitud'
				break;

			default:
				this.solicitudRouteByRol = '/solicitud'
				break;
		}
	}

	// Se seleccionan o deseleccionan todas las instituciones
	selectAllInstituciones() {
		// Valor opuesto al que se tenía
		this.selectInstituciones = !this.selectInstituciones;
		// FormHelper se encarga de la operación
		this.fh.selectAllCheckboxes(this.instituciones, this.selectInstituciones);
	}

	// Cambia validación de apellidos
	setApellidosValidation() {
		if (this.datosFiscales.get('tipoPersona').value == 'fisica') {
			// Persona física -> se requieren apellidos
			this.datosFiscales.get('apellidoP').setValidators(Validators.required);
			this.datosFiscales.get('apellidoM').setValidators(Validators.required);
			this.esPersonaFisica = true;
			this.esPersonaMoral = false;
		} else {
			// Persona moral -> no se requieren apellidos
			this.datosFiscales.get('apellidoP').setValidators([]);
			this.datosFiscales.get('apellidoM').setValidators([]);
			this.esPersonaMoral = true;
			this.esPersonaFisica = false;
		}
		this.datosFiscales.get('apellidoP').updateValueAndValidity();
		this.datosFiscales.get('apellidoM').updateValueAndValidity();
	}

	// Cambia validación de RFC
	setRFCValidation() {
		if (this.datosFiscales.get('pais').value == 'MX') {
			// Persona física -> se requieren apellidos
			this.datosFiscales.get('rfc')
				.setValidators([
					Validators.required,
					this.fh.regExValidator(/[A-Z|Ñ|&]{4}[0-9]{2}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))[A-Z||Ñ|&|0-9]{2}[0-9]/)
				]);
		} else {
			// Persona moral -> no se requieren apellidos
			this.datosFiscales.get('rfc').setValidators(Validators.required);
		}
		this.datosFiscales.get('rfc').updateValueAndValidity();
	}

	// Regresa arreglo con las instituciones elegidas
	getInstitucionesStrings(): string[] {
		var s = new Array<string>();
		for (var i = 0; i < this.todasInstituciones.length; i++) {
			if (this.instituciones.controls[i].value)
				s.push(this.todasInstituciones[i]);
		}
		return s;

	}

	// Muestra el modal
	showModal(template: TemplateRef<any>, typeModal) {
		this.typeModal = typeModal;
		this.modalRecRef = this.modalService.show(template);
	}

	// Se realiza preregistro
	enviarPreRegistro(template: TemplateRef<any>) {
		// Desea cancelar la pre-solicitud?
		if (this.cancelarPreregistro) {
			swal({
				title: '¿Desea deshacer pre-solicitud?',
				text: 'Aceptar para deshacer pre-solicitud',
				showCancelButton: true,
				showConfirmButton: true,
				showCloseButton: true,
				confirmButtonText: 'Aceptar',
				cancelButtonText: 'Cancelar',
				type: 'warning'
			}).then((accept) => {
				if (accept) {
					this.router.navigate(['/home']);
				}
				this.cancelarPreregistro = false;
			}).catch((err) => {
				this.cancelarPreregistro = false;
			})
		} else {

			if (this.providerVip) { //ProveedorVIP
				this.preregistroForm.controls['comentarios']['controls']['terminos'].patchValue(this.terminos);
				this.preregistroForm.controls['comentarios']['controls']['politicaPriv'].patchValue(this.politicaPriv);
				let pr = this.preregistroForm.value;
				pr.instituciones = this.getInstitucionesStrings();
				console.log(pr);
				if (pr.comentarios.terminos && pr.comentarios.politicaPriv) {
					if (this.preregistroForm.valid) {
						// Campos válidos, se realiza preregistro

						// Se envía
						this.profile.postPreregistroWhole(pr).subscribe((res) => {
							if (res) {
								swal({
									title: 'Estimado Proveedor del Tecnológico de Monterrey',
									text: 'Hemos recibido su solicitud, la cual será procesada por nuestros especialistas,  en breve recibirá un correo electrónico a la cuenta que nos proporciono en el apartado de ventas, en el cual se le notifica su alta o alguna observación para poder procesarla,  así como algunas instrucciones relacionadas al proceso de compra, entrega de mercancía y pagos.',
									type: 'success',
									showCloseButton: true
								}).then((ok) => {
									if (ok) {
										this.router.navigate([this.solicitudRouteByRol]);
									}
								}).catch((err) => { })
							}
						})
					} else {
						// Muestra mensajes de validación
						this.fh.validateAllFormFields(this.preregistroForm);
						// Campos inválidos, no se envía
						swal({
							title: 'Datos incompletos',
							text: 'Favor de llenar los campos necesarios de manera correcta para continuar.',
							type: 'error',
							showCloseButton: true
						}).catch((err) => { });
					}
				} else {
					swal({
						title: 'Error!',
						text: 'Favor de aceptar terminos y condiciones para continuar.',
						type: 'error',
						showCloseButton: true
					}).catch((err) => { });
				}
			} else {
				//Proveedor normal
				let pr = this.preregistroForm.value;
				pr.instituciones = this.getInstitucionesStrings();
				if (this.preregistroForm.valid) {
					// Campos válidos, se realiza preregistro

					// Se envía
					this.profile.postPreregistro(pr).subscribe((res) => {
						if (res) {
							swal({
								title: 'Estimado Proveedor del Tecnológico de Monterrey',
								text: 'Hemos recibido su solicitud, la cual será procesada por nuestros especialistas,  en breve recibirá un correo electrónico a la cuenta que nos proporciono en el apartado de ventas, en el cual se le notifica su alta o alguna observación para poder procesarla,  así como algunas instrucciones relacionadas al proceso de compra, entrega de mercancía y pagos.',
								type: 'success',
								showCloseButton: true
							}).then((ok) => {
								if (ok) {
									this.router.navigate([this.solicitudRouteByRol]);
								}
							}).catch((err) => { })
						}
					})
				} else {
					// Muestra mensajes de validación
					this.fh.validateAllFormFields(this.preregistroForm);
					// Campos inválidos, no se envía
					swal({
						title: 'Datos incompletos',
						text: 'Favor de llenar los campos necesarios de manera correcta para continuar.',
						type: 'error',
						showCloseButton: true
					}).catch((err) => { });
				}

			}

		}
	}
}
