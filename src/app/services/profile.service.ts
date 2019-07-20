import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Solicitud } from '../shared/solicitud.model';
import { TokenStorage } from '../auth/token.storage';

@Injectable({
	providedIn: 'root'
})
export class ProfileService {
	// Urls de llamadas a API
	preregUrl = 'http://localhost:4040/api/preregistration';
	regUrl = 'http://localhost:4040/api/registration';
	authUrl = 'http://localhost:4040/api/auth/'

	// Opciones con headers para llamadas Http
	httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + this.token.getToken()
		})
	};

	constructor(private http: HttpClient, private token: TokenStorage) { }

	// Envía datos de preregistro
	postRefreshToken(rfc: Object) {
		return this.http.post(this.authUrl + 'refresh-token', JSON.stringify({rfc}), this.httpOptions)
	}
	
	// Envía datos de preregistro
	postPreregistro(form: Object) {
		return this.http.post(this.preregUrl, JSON.stringify(form), this.httpOptions)
	}

	// Envía datos de preregistro VIP
	postPreregistroWhole(form: Object) {
		return this.http.post(this.preregUrl + '/whole', JSON.stringify(form), this.httpOptions)
	}

	// Envía datos de registro
	putRegistro(form: Object, id) {
		console.log(id);
		return this.http.put(this.preregUrl + '/' + id, JSON.stringify(form), this.httpOptions)
	}

	getSolicitud(rfc: string, status: string) {
		return this.http.get(this.preregUrl + '/' + rfc + '/' + status, this.httpOptions);
	}
}
