import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

declare var swal;

@Component({
	selector: 'app-configuracion',
	templateUrl: './configuracion.component.html',
	styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

	masterDataOptions = [];
	options: string[] = [];
	filteredOptions: Observable<string[]>;

	activeRol: string;
	disableEditExpTimes: boolean = true;
	editMasterDataForm: boolean = true;
	expTime = {
		comprador: 10,
		proveedor: 10
	}
	configId: string;

	configuracionForm = this.fb.group({

		datosMaestros: this.fb.group({
			conceptoBus1: [''],
			grupoCuentas: [''],
			cuentaAsociada: [''],
			grupoTesoreria: [''],
			sociedad: [''],
			formaCom: [''],
			entradaInd: [''],
			verifFac: [''],
			orgCompras: [''],
			idioma: [''],
			retencionInd01: [''],
			retencionTipo01: [''],
			sujeto01: [''],
			ramo: [''],
			viaPago: [''],
			retencionInd02: [''],
			retencionTipo02: [''],
			sujeto02: ['']
		})
	});

	slideActive: boolean = false;

	constructor(private admin: AdminService, private fb: FormBuilder) { }

	ngOnInit() {
		this.admin.getConfiguraciones().subscribe((configs) => {
			this.expTime.comprador = configs[0].comprador
			this.expTime.proveedor = configs[0].proveedor
			this.configId = configs[0]._id;
			this.preLoadMasterData();
		})
	}

	editExpTimes(event) {
		if (event.checked) { //Puede editar
			this.disableEditExpTimes = false;
		} else {
			this.disableEditExpTimes = true;
		}
	}

	saveChanges() {
		let form = this.expTime;
		let id = this.configId
		this.slideActive = false;
		this.admin.postConfiguraciones(form, id).subscribe((res) => {
			if (res) {
				swal('Actualizado!', 'Se han guardado los cambios correctamente', 'success').then((res) => {
					this.disableEditExpTimes = true;
				})
			}
		})
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
			this.filteredOptions = this.configuracionForm.controls['datosMaestros']['controls']['grupoCuentas'].valueChanges
				.pipe(
					startWith(''),
					map(value => this._filter(value))
				);
		})
	}

	postDataMasterOption() {
		//Esta lleno el campo de grupo cuentas?
		if (this.configuracionForm.controls['datosMaestros']['controls']['grupoCuentas'].value) {
			let existAccount = false;
			let option;
			for (let i = 0; i < this.masterDataOptions.length; i++) {
				option = this.masterDataOptions[i];
				//Ya existe la cuenta?
				if (option['masterData']['accountGroup'] === this.configuracionForm.controls['datosMaestros']['controls']['grupoCuentas'].value) {
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
					this.admin.updateDatosMaestros({ id: option._id }, { datosMaestros: this.configuracionForm.controls.datosMaestros.value }).subscribe((res) => {
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
					this.admin.postDatosMaestros({ datosMaestros: this.configuracionForm.controls.datosMaestros.value }).subscribe((res) => {
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

	private _filter(value: any): string[] {
		this.masterDataOptions.forEach((option) => {
			if (value === option['masterData']['accountGroup']) {
				this.configuracionForm.controls['datosMaestros']['controls']['conceptoBus1'].patchValue(option['masterData']['conceptBus']);
				this.configuracionForm.controls['datosMaestros']['controls']['cuentaAsociada'].patchValue(option['masterData']['associateAcount']);
				this.configuracionForm.controls['datosMaestros']['controls']['grupoTesoreria'].patchValue(option['masterData']['treasuryGroup']);
				this.configuracionForm.controls['datosMaestros']['controls']['sociedad'].patchValue(option['masterData']['society']);
				this.configuracionForm.controls['datosMaestros']['controls']['formaCom'].patchValue(option['masterData']['comForm']);
				this.configuracionForm.controls['datosMaestros']['controls']['entradaInd'].patchValue(option['masterData']['singleEntry']);
				this.configuracionForm.controls['datosMaestros']['controls']['verifFac'].patchValue(option['masterData']['verifyFac']);
				this.configuracionForm.controls['datosMaestros']['controls']['orgCompras'].patchValue(option['masterData']['salesOrg']);
				this.configuracionForm.controls['datosMaestros']['controls']['idioma'].patchValue(option['masterData']['language']);
				this.configuracionForm.controls['datosMaestros']['controls']['retencionInd01'].patchValue(option['masterData']['retentionSing01']);
				this.configuracionForm.controls['datosMaestros']['controls']['retencionTipo01'].patchValue(option['masterData']['retentionType01']);
				this.configuracionForm.controls['datosMaestros']['controls']['sujeto01'].patchValue(option['masterData']['subject01']);
				this.configuracionForm.controls['datosMaestros']['controls']['ramo'].patchValue(option['masterData']['branch']);
				this.configuracionForm.controls['datosMaestros']['controls']['viaPago'].patchValue(option['masterData']['paymentWay']);
				this.configuracionForm.controls['datosMaestros']['controls']['retencionInd02'].patchValue(option['masterData']['retentionSing02']);
				this.configuracionForm.controls['datosMaestros']['controls']['retencionTipo02'].patchValue(option['masterData']['retentionType02']);
				this.configuracionForm.controls['datosMaestros']['controls']['sujeto02'].patchValue(option['masterData']['subject02']);
			}
		})
		const filterValue = value.toLowerCase();
		return this.options.filter(option => {
			return option.toLowerCase().includes(filterValue)
		});
	}

}
