import { Component, OnInit, TemplateRef } from '@angular/core';
import {
	FormGroup,
	FormControl,
	FormBuilder,
	FormArray,
	Validators
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DataService } from '../services/data.service';
import { ProfileService } from '../services/profile.service';
import { FormsHelperService } from '../services/forms-helper.service';
import { Solicitud } from '../shared/solicitud.model';
import { AdminService } from '../services/admin.service';
import { TokenStorage } from '../auth/token.storage';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import decode from 'jwt-decode';

declare var swal: any;

@Component({
	selector: 'registro',
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
	// id: string; // Id del la solicitud mostrada en este registro
	// status: string; // Status de la solicitud mostrada en este registro
	rfc: string // RFC de la solicitud mostrada en este registro

	// Modal de confirmación
	modalRecRef: BsModalRef;

	typeModal: number;
	terminos: boolean = false;
	politicaPriv: boolean = false;
	esPersonaFisica: boolean = false;
	esPersonaMoral: boolean = false;

	regFromServ;

	// Para (des)seleccionar todas las instituciones
	selectInstituciones: boolean = false;

	options: string[] = [];
	masterDataOptions = [];
	filteredOptions: Observable<string[]>;

	status: string; // status de la solicitud mostrada en este registro

	// Arreglos con valores disponibles para campos a seleccionar
	todasInstituciones: Array<string>;
	insumos: Array<string>;
	giros: Array<string>;
	paises: Array<string>;
	regiones: Array<string>;
	proveedorVip = false;
	proveedor = false;
	comprador = false;
	adminR = false;
	params: String;
	// Registro FormGroup
	registroForm = this.fb.group({

		// Instituciones
		instituciones: this.fb.array([
		], this.fh.minSelectedCheckboxes(1)),

		// Datos Fiscales
		datosFiscales: this.fb.group({
			tipoPersona: [undefined, Validators.required],
			rfc: ['', Validators.required],
			curp: [''],
			insumo: ['', Validators.required],
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
			email: [''],
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

		datosComprador: this.fb.group({
			condicionesPago: [''],
			grupoEstudiantil: [''],
			comentarios: ['']
		}),

		datosMaestros: this.fb.group({
			conceptoBus1: [''],
			grupoCuentas: [''],
			cuentaAsociada: [''],
			grupoTesoreria: [''],
			sociedad: [''],
			formaCom: [''],
			entradaInd: [''],
			verifFac: [''],
			idioma: [''],
			retencionInd01: [''],
			retencionTipo01: [''],
			sujeto01: [''],
			ramo: [''],
			viaPago: [''],
			retencionInd02: [''],
			retencionTipo02: [''],
			sujeto02: ['']
		}),

		autorizador: this.fb.group({
			fechaAut: [''],
			autorizador: ['']
		}),

		creacion: this.fb.group({
			fechaCre: [''],
			creador: ['']
		}),

		usuario: this.fb.group({
			email: [''],
			rfc: ['']
		}),
	});
	userRol: string;
	reqId: string;
	disableAuthButton: boolean = false;

	// Getter para FormArray de instituciones
	get instituciones() {
		return this.registroForm.get('instituciones') as FormArray;
	}

	// Getter para FormGroup de datosFiscales
	get datosFiscales() {
		return this.registroForm.get('datosFiscales') as FormGroup;
	}

	get datosBanco() {
		return this.registroForm.get('datosBanco') as FormGroup;
	}

	get comentarios() {
		return this.registroForm.get('comentarios') as FormGroup;
	}

	get datosComprador() {
		return this.registroForm.get('datosComprador') as FormGroup;
	}

	get datosMaestros() {
		return this.registroForm.get('datosMaestros') as FormGroup;
	}

	constructor(
		private modalService: BsModalService,
		private fb: FormBuilder,
		private data: DataService,
		private profile: ProfileService,
		private fh: FormsHelperService,
		private route: ActivatedRoute,
		private admin: AdminService,
		private token: TokenStorage,
		public router: Router
	) { }

	ngOnInit() {
		this.params = this.route.params['_value'];

		const token = this.token.getToken();
		if (token) {
			const tokenPayload = decode(token);
			switch (tokenPayload.rol) {
				case 'admin':
					this.adminR = true;
					this.preLoadMasterData();
					break;
				case 'comprador':
					this.comprador = true;
					// if(this.regFromServ.comentarios)
					break;

				case 'proveedor':
					if (tokenPayload.fullForm) {
						this.proveedorVip = true
					} else {
						this.proveedor = true;
					}
					break;
				default:
					if (tokenPayload.fullForm) {
						this.proveedorVip = true
					} else {
						this.proveedor = true;
					}
					break;
			}
		}

		// Obtiene parámetro con el rfc de la solicitud
		this.route.queryParams
			.subscribe(
				(params: Params) => {
					this.rfc = params['rfc'];
					this.loadRegistro();
				}
			);

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

	// Se seleccionan o deseleccionan todas las instituciones
	selectAllInstituciones() {
		// Valor opuesto al que se tenía
		this.selectInstituciones = !this.selectInstituciones;
		// FormHelper se encarga de la operación
		this.fh.selectAllCheckboxes(this.instituciones, this.selectInstituciones);
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

	// Carga información previamente registrada 
	loadRegistro() {
		this.route.params.subscribe((params) => {
			this.profile.getSolicitud(this.rfc, params.status).subscribe((registro) => {
				if (this.comprador) {
					this.disableAuthButton = this.disableAuthBotonComprador(registro);
				}
				this.status = params.status;
				this.setRegistro(registro)
			});
		});
	}

	disableAuthBotonComprador(registro) {
		if (registro['complementaryInfo']) {
			if (registro['complementaryInfo'].paymentConditions) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	// Establece información previamente registrada 
	setRegistro(registro: Solicitud) {
		if (this.proveedor) {
			this.reqId = registro['_id'];
		}
		if (registro) {
			//Cambia validacion de apellidos respecto al registro previamente cargado
			this.setApellidosValidation();

			//Se establecen las instituciones
			for (const key in this.registroForm.controls['instituciones']['controls']) {
				if (this.registroForm.controls['instituciones']['controls'].hasOwnProperty(key)) {
					const instituciones = this.registroForm.controls['instituciones']['controls'];
					this.data.instituciones.forEach((dataInstitucion, i) => {
						if (dataInstitucion === registro['institutions'][key]) {
							instituciones[i].patchValue(registro['institutions'][key]);
						}
					});
				}
			}

			//Se establecen los datos fiscales
			this.registroForm.controls['datosFiscales']['controls']['apellidoM'].patchValue(registro['fiscalData']['lastName1']);
			this.registroForm.controls['datosFiscales']['controls']['apellidoP'].patchValue(registro['fiscalData']['lastName2']);
			this.registroForm.controls['datosFiscales']['controls']['calle'].patchValue(registro['fiscalData']['street']);
			this.registroForm.controls['datosFiscales']['controls']['codigoPostal'].patchValue(registro['fiscalData']['postalCode']);
			this.registroForm.controls['datosFiscales']['controls']['colonia'].patchValue(registro['fiscalData']['suburb']);
			this.registroForm.controls['datosFiscales']['controls']['curp'].patchValue(registro['fiscalData']['curp']);
			this.registroForm.controls['datosFiscales']['controls']['giro'].patchValue(registro['businessTurn']);
			this.registroForm.controls['datosFiscales']['controls']['insumo'].patchValue(registro['input']);
			this.registroForm.controls['datosFiscales']['controls']['nombre'].patchValue(registro['fiscalData']['name']);
			this.registroForm.controls['datosFiscales']['controls']['numero'].patchValue(registro['fiscalData']['number']);
			this.registroForm.controls['datosFiscales']['controls']['pais'].patchValue(registro['fiscalData']['contry']);
			this.registroForm.controls['datosFiscales']['controls']['poblacion'].patchValue(registro['fiscalData']['city']);
			this.registroForm.controls['datosFiscales']['controls']['region'].patchValue(registro['fiscalData']['region']);
			this.registroForm.controls['datosFiscales']['controls']['rfc'].patchValue(registro['fiscalData']['rfc']);
			this.registroForm.controls['datosFiscales']['controls']['tipoPersona'].patchValue(registro['fiscalData']['personaType']);

			//Se establecen los datos de ventas
			this.registroForm.controls['datosVentas']['controls']['email'].patchValue(registro['salesData']['email']);
			this.registroForm.controls['datosVentas']['controls']['empleadoDueno'].patchValue(registro['salesData']['typeEmployee']);
			this.registroForm.controls['datosVentas']['controls']['exatec'].patchValue(registro['salesData']['exaTec']);
			this.registroForm.controls['datosVentas']['controls']['ext'].patchValue(registro['salesData']['ext']);
			this.registroForm.controls['datosVentas']['controls']['ext2'].patchValue(registro['salesData']['ext2']);
			this.registroForm.controls['datosVentas']['controls']['ext2'].patchValue(registro['salesData']['ext2']);
			this.registroForm.controls['datosVentas']['controls']['extFax'].patchValue(registro['salesData']['extFax']);
			this.registroForm.controls['datosVentas']['controls']['fax'].patchValue(registro['salesData']['fax']);
			this.registroForm.controls['datosVentas']['controls']['nombreContacto'].patchValue(registro['salesData']['contactName']);
			this.registroForm.controls['datosVentas']['controls']['pagina'].patchValue(registro['salesData']['webPage']);
			this.registroForm.controls['datosVentas']['controls']['telFijo'].patchValue(registro['salesData']['phone']);
			this.registroForm.controls['datosVentas']['controls']['telFijo2'].patchValue(registro['salesData']['phone2']);
			this.registroForm.controls['datosVentas']['controls']['telMovil'].patchValue(registro['salesData']['mobilePhone']);

			//Se establecen los datos de banco
			this.registroForm.controls['datosBanco']['controls']['paisBanco'].patchValue(registro['bankData']['bankCountry']);
			this.registroForm.controls['datosBanco']['controls']['banco'].patchValue(registro['bankData']['bank']);
			this.registroForm.controls['datosBanco']['controls']['clabe'].patchValue(registro['bankData']['clabe']);
			this.registroForm.controls['datosBanco']['controls']['titularCuenta'].patchValue(registro['bankData']['headline']);
			this.registroForm.controls['datosBanco']['controls']['claveControl'].patchValue(registro['bankData']['controlKey']);
			this.registroForm.controls['datosBanco']['controls']['moneda'].patchValue(registro['bankData']['currency']);
			this.registroForm.controls['datosBanco']['controls']['contactoCobranza'].patchValue(registro['bankData']['contact']);
			this.registroForm.controls['datosBanco']['controls']['telefono'].patchValue(registro['bankData']['phoneNum']);
			this.registroForm.controls['datosBanco']['controls']['email'].patchValue(registro['bankData']['email']);

			//Se establecen los datos de comentarios
			this.registroForm.controls['comentarios']['controls']['comentarios'].patchValue(registro['comments']['comment']);
			this.registroForm.controls['comentarios']['controls']['terminos'].patchValue(registro['comments']['tecTerms']);
			this.registroForm.controls['comentarios']['controls']['politicaPriv'].patchValue(registro['comments']['politicsPrivacy']);
			this.politicaPriv = registro['comments']['tecTerms']
			this.terminos = registro['comments']['politicsPrivacy']

			//Se establecen los datos del usuario
			this.registroForm.controls['usuario']['controls']['email'].patchValue(registro['user']['email'])
			this.registroForm.controls['usuario']['controls']['rfc'].patchValue(registro['user']['rfc'])

			if (registro['complementaryInfo'] || registro['masterData']) {
				//Se establecen los datos de informacion complementaria comprador
				this.registroForm.controls['datosComprador']['controls']['condicionesPago'].patchValue(registro['complementaryInfo']['paymentConditions']);
				this.registroForm.controls['datosComprador']['controls']['grupoEstudiantil'].patchValue(registro['complementaryInfo']['studentGroup']);
				this.registroForm.controls['datosComprador']['controls']['comentarios'].patchValue(registro['complementaryInfo']['comments']);

				//Se establecen los datos de autorizacion
				this.registroForm.controls['autorizador']['controls']['autorizador'].patchValue(registro['authorization']['authorizator']);
				this.registroForm.controls['autorizador']['controls']['fechaAut'].patchValue(registro['authorization']['authDate']);
			}

			//Se establecen los datos maestros
			if (registro['masterData']) {
				this.registroForm.controls['datosMaestros']['controls']['grupoCuentas'].patchValue(registro['masterData']['accountGroup']);
				this.registroForm.controls['datosMaestros']['controls']['conceptoBus1'].patchValue(registro['masterData']['conceptBus']);
				this.registroForm.controls['datosMaestros']['controls']['cuentaAsociada'].patchValue(registro['masterData']['associateAcount']);
				this.registroForm.controls['datosMaestros']['controls']['grupoTesoreria'].patchValue(registro['masterData']['treasuryGroup']);
				this.registroForm.controls['datosMaestros']['controls']['sociedad'].patchValue(registro['masterData']['society']);
				this.registroForm.controls['datosMaestros']['controls']['formaCom'].patchValue(registro['masterData']['comForm']);
				this.registroForm.controls['datosMaestros']['controls']['entradaInd'].patchValue(registro['masterData']['singleEntry']);
				this.registroForm.controls['datosMaestros']['controls']['verifFac'].patchValue(registro['masterData']['verifyFac']);
				this.registroForm.controls['datosMaestros']['controls']['idioma'].patchValue(registro['masterData']['language']);
				this.registroForm.controls['datosMaestros']['controls']['retencionInd01'].patchValue(registro['masterData']['retentionSing01']);
				this.registroForm.controls['datosMaestros']['controls']['retencionTipo01'].patchValue(registro['masterData']['retentionType01']);
				this.registroForm.controls['datosMaestros']['controls']['sujeto01'].patchValue(registro['masterData']['subject01']);
				this.registroForm.controls['datosMaestros']['controls']['ramo'].patchValue(registro['masterData']['branch']);
				this.registroForm.controls['datosMaestros']['controls']['viaPago'].patchValue(registro['masterData']['paymentWay']);
				this.registroForm.controls['datosMaestros']['controls']['retencionInd02'].patchValue(registro['masterData']['retentionSing02']);
				this.registroForm.controls['datosMaestros']['controls']['retencionTipo02'].patchValue(registro['masterData']['retentionType02']);
				this.registroForm.controls['datosMaestros']['controls']['sujeto02'].patchValue(registro['masterData']['subject02']);

				//Se establecen los datos de creacion
				this.registroForm.controls['creacion']['controls']['creador'].patchValue(registro['creation']['creator']);
				this.registroForm.controls['creacion']['controls']['fechaCre'].patchValue(registro['creation']['createdAt']);
			}
		}
	}

	preLoadMasterData() {
		this.admin.getDatosMaestros().subscribe((accounts) => {
			this.options = [];
			this.masterDataOptions = [];
			for (const key in accounts) {
				if (accounts.hasOwnProperty(key)) {
					const account = accounts[key];
					this.options.push(account.masterData.accountGroup)
					this.masterDataOptions.push(account);
				}
			}
			this.filteredOptions = this.registroForm.controls['datosMaestros']['controls']['grupoCuentas'].valueChanges
				.pipe(
					startWith(''),
					map(value => this._filter(value))
				);
		})
	}

	private _filter(value: any): string[] {
		this.masterDataOptions.forEach((option) => {
			if (value === option['masterData']['accountGroup']) {
				this.registroForm.controls['datosMaestros']['controls']['conceptoBus1'].patchValue(option['masterData']['conceptBus']);
				this.registroForm.controls['datosMaestros']['controls']['cuentaAsociada'].patchValue(option['masterData']['associateAcount']);
				this.registroForm.controls['datosMaestros']['controls']['grupoTesoreria'].patchValue(option['masterData']['treasuryGroup']);
				this.registroForm.controls['datosMaestros']['controls']['sociedad'].patchValue(option['masterData']['society']);
				this.registroForm.controls['datosMaestros']['controls']['formaCom'].patchValue(option['masterData']['comForm']);
				this.registroForm.controls['datosMaestros']['controls']['entradaInd'].patchValue(option['masterData']['singleEntry']);
				this.registroForm.controls['datosMaestros']['controls']['verifFac'].patchValue(option['masterData']['verifyFac']);
				this.registroForm.controls['datosMaestros']['controls']['idioma'].patchValue(option['masterData']['language']);
				this.registroForm.controls['datosMaestros']['controls']['retencionInd01'].patchValue(option['masterData']['retentionSing01']);
				this.registroForm.controls['datosMaestros']['controls']['retencionTipo01'].patchValue(option['masterData']['retentionType01']);
				this.registroForm.controls['datosMaestros']['controls']['sujeto01'].patchValue(option['masterData']['subject01']);
				this.registroForm.controls['datosMaestros']['controls']['ramo'].patchValue(option['masterData']['branch']);
				this.registroForm.controls['datosMaestros']['controls']['viaPago'].patchValue(option['masterData']['paymentWay']);
				this.registroForm.controls['datosMaestros']['controls']['retencionInd02'].patchValue(option['masterData']['retentionSing02']);
				this.registroForm.controls['datosMaestros']['controls']['retencionTipo02'].patchValue(option['masterData']['retentionType02']);
				this.registroForm.controls['datosMaestros']['controls']['sujeto02'].patchValue(option['masterData']['subject02']);
			}
		})
		const filterValue = value.toLowerCase();
		return this.options.filter(option => {
			return option.toLowerCase().includes(filterValue)
		});
	}

	postDataMasterOption() {
		//Esta lleno el campo de grupo cuentas?
		if (this.registroForm.controls['datosMaestros']['controls']['grupoCuentas'].value) {
			let existAccount = false;
			let option;
			for (let i = 0; i < this.masterDataOptions.length; i++) {
				option = this.masterDataOptions[i];
				//Ya existe la cuenta?
				if (option['masterData']['accountGroup'] === this.registroForm.controls['datosMaestros']['controls']['grupoCuentas'].value) {
					existAccount = true;
					break;
				}
			}
			if (existAccount) {
				swal({
					title: '¿Desea actualizar este formulario de referencia de datos maestros?',
					text: 'Aceptar para actualizar nuevo formulario de referencia',
					showCancelButton: true,
					showConfirmButton: true,
					confirmButtonText: 'Aceptar',
					cancelButtonText: 'Cancelar',
					type: 'warning'
				}).then(() => {
					this.admin.updateDatosMaestros({ id: option._id }, { datosMaestros: this.registroForm.controls.datosMaestros.value }).subscribe((res) => {
						this.preLoadMasterData();
						swal('Formulario de referencia actualizado',
							'Se ha actualizado el formulario de referencia para datos maestros correctamente',
							'success')
					})
				}).catch(() => {

				})
			} else {
				swal({
					title: '¿Desea crear nuevo formulario de referencia para los datos maestros?',
					text: 'Aceptar para crear nuevo formulario de referencia',
					showCancelButton: true,
					showConfirmButton: true,
					confirmButtonText: 'Aceptar',
					cancelButtonText: 'Cancelar',
					type: 'warning'
				}).then(() => {
					this.admin.postDatosMaestros({ datosMaestros: this.registroForm.controls.datosMaestros.value }).subscribe((res) => {
						this.preLoadMasterData();
						swal('Formulario de referencia creado',
							'Se ha creado el formulario de referencia para datos maestros correctamente',
							'success')
					})
				}).catch(() => {

				})
			}

		}
	}

	showModal(template: TemplateRef<any>, typeModal) {
		this.typeModal = typeModal;
		this.modalRecRef = this.modalService.show(template);
	}

	//
	enviarRegistro() {
		let updateInstituciones = this.getInstitucionesStrings();;
		let reg = this.registroForm.value
		this.registroForm.value.instituciones = [];
		this.registroForm.value.instituciones = updateInstituciones
		this.admin.postAuthorization(this.params, reg);
		swal({
			title: 'Solicitud aprobada',
			text: 'Se notificara al proveedor que su solicitud fue aprobada',
			type: 'success',
			showCloseButton: true
		}).then((reason) => {
			if (this.proveedor) {
				this.router.navigate(['/solicitud']);
			} else {
				this.router.navigate(['/solicitudes']);
			}
		}).catch((err) => {
			if (this.proveedor) {
				this.router.navigate(['/solicitud']);
			} else {
				this.router.navigate(['/solicitudes']);
			}
		})
	}

	rechazarRegistro() {
		if (this.adminR) {
			swal({
				input: 'text',
				title: 'Solicitud rechazada',
				text: 'Se notificara al comprador de solicitud rechazada por el motivo:',
				type: 'info',
				showCloseButton: true
			}).then((reason) => {
				if (reason) {
					this.admin.patchRejectionAdmin(this.params, reason);
					this.router.navigate(['/solicitudes']);
				} else {
					this.admin.patchRejectionAdmin(this.params, '');
					this.router.navigate(['/solicitudes']);
				}
			}).catch((err) => {
			})
		}
		else if (this.comprador) {
			swal({
				input: 'text',
				title: 'Solicitud rechazada',
				text: 'Se notificara al proveedor de solicitud rechazada por el motivo:',
				type: 'info',
				showCloseButton: true
			}).then((reason) => {
				if (reason) {
					this.admin.patchRejection(this.params, reason);
					this.router.navigate(['/solicitudes']);
				} else {
					this.admin.patchRejection(this.params, '');
					this.router.navigate(['/solicitudes']);
				}
			}).catch((err) => {
			})
		} else if (this.proveedor || this.proveedorVip) {
			swal({
				title: '¿Desea cancelar solicitud?',
				text: 'Aceptar para cancelar solicitud',
				showCancelButton: true,
				showConfirmButton: true,
				confirmButtonText: 'Aceptar',
				cancelButtonText: 'Cancelar',
				type: 'warning'
			}).then((accept) => {
				if (accept) {
					this.admin.deleteSolicitud(this.rfc)
					this.router.navigate(['/solicitud']);
					swal({
						title: 'Solictud cancelada',
						text: 'Solicitud cancelada satisfactoriamente.',
						type: 'success',
						showCloseButton: true
					});
				}
			}).catch((err) => {
			})
		}
	}

	editarRegistro() {
		let updateInstituciones = this.getInstitucionesStrings();;
		let reg = this.registroForm.value
		this.registroForm.value.instituciones = [];
		this.registroForm.value.instituciones = updateInstituciones
		this.admin.updateSolicitud(this.params, '?rfc=' + this.rfc, reg).subscribe((res) => {
			swal({
				title: 'Solicitud actualizada',
				text: 'Se ha actualizado la informacion correctamente',
				type: 'success',
				showCloseButton: true
			}).then((res) => {
				this.router.navigate(['/solicitud']);
			})
		});
	}

	completarRegistro() {
		this.registroForm.controls['comentarios']['controls']['terminos'].patchValue(this.terminos);
		this.registroForm.controls['comentarios']['controls']['politicaPriv'].patchValue(this.politicaPriv);
		let updateInstituciones = this.getInstitucionesStrings();;
		let reg = this.registroForm.value

		if (reg.comentarios.terminos && reg.comentarios.politicaPriv) {
			reg.instituciones = [];
			reg.instituciones = updateInstituciones
			this.profile.putRegistro(reg, this.reqId).subscribe(res => {
				swal({
					title: 'Solicitud completada',
					text: 'Se notificara al comprador que su solicitud fue completada',
					type: 'success'
				}).then((reason) => {
					if (this.proveedor) {
						this.router.navigate(['/solicitud']);
					} else {
						this.router.navigate(['/solicitudes']);
					}
				}).catch((err) => {
					if (this.proveedor) {
						this.router.navigate(['/solicitud']);
					} else {
						this.router.navigate(['/solicitudes']);
					}
				})
			});
		} else {
			swal({
				title: 'Error!',
				text: 'Favor de aceptar terminos y condiciones para continuar.',
				type: 'error',
				showCloseButton: true
			}).catch((err) => { });
		}
	}

	autorizar() { //Comprador de 
		if ((this.status === 'Completada' || this.status === 'Actualizada') &&
			this.datosComprador.get('condicionesPago').value
		) {
			let reg = { datosComprador: this.registroForm.value.datosComprador }
			this.admin.postPreAuthorization(this.params, reg);
			swal({
				title: 'Solicitud autorizada',
				text: 'Se notificara al administrador que su solicitud fue autorizada',
				type: 'success'
			}).then((reason) => {
				if (this.proveedor) {
					this.router.navigate(['/solicitud']);
				} else {
					this.router.navigate(['/solicitudes']);
				}
			}).catch((err) => {
				if (this.proveedor) {
					this.router.navigate(['/solicitud']);
				} else {
					this.router.navigate(['/solicitudes']);
				}
			})
		} else if (this.status === 'Solicitada') {
			let reg = { datosComprador: this.registroForm.value.datosComprador }
			this.admin.postPreAuthorization(this.params, reg);
			swal({
				title: 'Solicitud autorizada',
				text: 'Se notificara al administrador que su solicitud fue autorizada',
				type: 'success'
			}).then((reason) => {
				if (this.proveedor) {
					this.router.navigate(['/solicitud']);
				} else {
					this.router.navigate(['/solicitudes']);
				}
			}).catch((err) => {
				if (this.proveedor) {
					this.router.navigate(['/solicitud']);
				} else {
					this.router.navigate(['/solicitudes']);
				}
			})
		} else {
			swal({
				title: 'Faltan datos!',
				text: 'Favor de llenar los datos complementarios del comprador',
				type: 'error'
			}).then((reason) => {
			}).catch((err) => {
			})
		}
	}

}
