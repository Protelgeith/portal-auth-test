import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Aviso } from '../shared/aviso.model';
import { Solicitud } from '../shared/solicitud.model';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	getNotificationsUrl = "http://localhost:4040/api/notification/getall";

	httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
            //'Authorization': 'my-auth-token'
        })
    };

	
	private _instituciones: Array<string> = [
		'ITESM', 'Universidad TecMilenio', 'Tec Salud (Hospitales)', 'Sorteos', 'NIC'
	];
	get instituciones(): Array<string> { return this._instituciones };

	private _insumos: Array<string> = ["Bienes", "Servicios"];
	get insumos(): Array<string> { return this._insumos };

	private _giros: Array<string> = ["Limpieza", "Construcción", "Tecnología"];
	get giros(): Array<string> { return this._giros };

	private _paises: Array<string> = ["MX", "Estados Unidos", "Alemania"];
	get paises(): Array<string> { return this._paises };

	private _regiones: Array<string> = ["Nuevo León", "Jalisco", "CDMX", "Chihuahua"];
	get regiones(): Array<string> { return this._regiones };

	constructor(private http: HttpClient) { }

	/*getAvisoVigente():Observable<Aviso> {
		if(this._avisos.length)
			return of(this._avisos[0]);
		else
			return of(null);
	}*/

	getAvisos(): Observable<Array<Aviso>> {
		return this.http.get<Array<Aviso>>(this.getNotificationsUrl);
	}

}