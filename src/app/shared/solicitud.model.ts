export class Solicitud {
	
	constructor(
		_id: string,
		createdAt: string,
		fiscalData: {
			city: string,
			contry: string,
			curp: string,
			lastName1: string,
			lastName2: string,
			name: string,
			number: string,
			personaType: string,
			postalCode: string,
			region: string,
			rfc: string,
			street: string,
			suburb: string,
		},
		input: string[],
		institutions: string[],
		requestNumber: number,
		salesData: {
			contactName: string,
			email: string,
			exaTec: string,
			ext: string,
			ext2: string,
			mobilePhone: string,
			phone: string,
			phone2: string,
			typeEmployee: string,
			webPage: string,
		},
		status: string

	) {}

}