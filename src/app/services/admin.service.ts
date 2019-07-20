import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TokenStorage } from '../auth/token.storage';
import { Solicitud } from '../shared/solicitud.model';

@Injectable({
	providedIn: 'root'
})
export class AdminService {
	private reqUrl = 'http://localhost:4040/api/requests';
	private userRol = 'http://localhost:4040/api/user/'
	private myReqUrl = 'http://localhost:4040/api/requests/MyRequests';
	private postNotUrl = 'http://localhost:4040/api/notification';
	private getUrl = 'http://localhost:4040/api/preregistration/Solicitud';
	private authorization = 'http://localhost:4040/api/vendor/';
	private vendors = 'http://localhost:4040/api/vendor/prueba';
	private preAuthorization = 'http://localhost:4040/api/vendor/auth/';
	private deleteUrl = 'http://localhost:4040/api/preregistration/';
	private settings = 'http://localhost:4040/api/auth/settings';

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + this.token.getToken()
		})
	};

	constructor(private http: HttpClient, private token: TokenStorage) { }

	getConfiguraciones() {
		return this.http.get(this.settings, this.httpOptions);
	}

	getSolicitudes(): Observable<Array<Solicitud>> {
		return this.http.get<Array<Solicitud>>(this.reqUrl, this.httpOptions);
	}

	getHistoriales(id): Observable<any> {
		return this.http.get(this.reqUrl + '/' + id, this.httpOptions);
	}

	getDatosMaestros(): Observable<any> {
		return this.http.get(this.reqUrl + '/masterData', this.httpOptions);
	}

	getMySolicitudes(rfc: String): Observable<Array<Solicitud>> {
		return this.http.get<Array<Solicitud>>(this.myReqUrl + '?rfc=' + rfc, this.httpOptions);
	}

	getSolicitud(): Observable<Array<Solicitud>> {
		return this.http.get<Array<Solicitud>>(this.getUrl, this.httpOptions);
	}

	getVendors() {
		return this.http.get(this.vendors, this.httpOptions);
	}

	// Envía una notificación nueva al backend para agregarla
	postNotification(form: Object) {
		return this.http.post(this.postNotUrl, JSON.stringify(form), this.httpOptions);
	}

	postPreAuthorization(params, form: Object) {
		console.log(form);
		return this.http.put(this.preAuthorization + params.id, JSON.stringify(form), this.httpOptions)
			.subscribe(result => {
			})
	}

	postAuthorization(params, form: Object) {
		// console.log(form);
		return this.http.post(this.authorization + params.id + '?status=' + params.status, JSON.stringify(form), this.httpOptions)
			.subscribe(result => {
			})
	}

	postDatosMaestros(form) {
		return this.http.post(this.reqUrl + '/masterData', JSON.stringify(form), this.httpOptions);
	}

	postConfiguraciones(form, id) {
		return this.http.post(this.settings + '/' + id, JSON.stringify(form), this.httpOptions);
	}

	patchRejection(status, reason) {
		return this.http.patch(this.authorization + status.id + '?reason=' + reason, this.httpOptions)
			.subscribe(result => {
			})
	}

	patchRejectionAdmin(status, reason) {
		return this.http.patch(this.authorization + 'admin/' + status.id + '?reason=' + reason, this.httpOptions)
			.subscribe(result => {
			})
	}

	updateSolicitud(params, rfc, form: Object) {
		return this.http.put(this.authorization + params.id + rfc, JSON.stringify(form), this.httpOptions)
	}

	updateDatosMaestros(params, form) {
		return this.http.put(this.reqUrl + '/masterData/' + params.id, JSON.stringify(form), this.httpOptions)
	}

	updateRolByUser(id, form) {
		return this.http.put(this.userRol + id, JSON.stringify(form), this.httpOptions)
	}

	deleteSolicitud(rfc) {
		return this.http.delete(this.deleteUrl + rfc, this.httpOptions)
			.subscribe(result => {
			})
	}

}