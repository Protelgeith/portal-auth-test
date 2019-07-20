import { Injectable } from '@angular/core';
import { 
        FormGroup, 
        FormControl, 
        FormArray, 
        Validators, 
        ValidatorFn, 
        AbstractControl
       } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class FormsHelperService {
	
	constructor() { }

	// Valida longitud de un FormArray con un mínimo de longitud
  minLengthArray(min: number) {
  	return (c: AbstractControl): {[key: string]: any} => {
  		if(c.value.length > min)
  			return null;

  		return { 'minLengthArray': {valid: false}}
  	};
  }

  // Valida longitud de un FormArray con un mínimo checkboxes de seleccionados
  minSelectedCheckboxes(min: number): ValidatorFn {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        // Hace una lista de los valores del checkbox
        .map(control => control.value)
        // Va sumando la cantidad de checkboxes marcadas
        .reduce((prev, next) => next ? prev + next : prev, 0);

      // Si el total de marcadas no es mayor al mínimo, hay error
      return totalSelected >= min ? null : { required: true };
    };

    return validator;
  }

  // Revisa si los campos en un FormGroup son válidos
  validateField(group: FormGroup, name: string){
    return (group.get(name).invalid && 
        (group.get(name).dirty || group.get(name).touched) );
  }

  // Muestra mensajes de validación en todos los campos de un grupo
  validateAllFormFields(formGroup: FormGroup) { 
  	// Itera por cada control del grupo        
    Object.keys(formGroup.controls).forEach(field => {  
      
      // Control/Grupo a iterar
      const control = formGroup.get(field);

      // Revisar si es FormControl/FormArray o FormGroup
      if (control instanceof FormControl || control instanceof FormArray) {
      	// Es un FormControl o FormArray, los marca como "Touched" para validarlos         
        control.markAsTouched({ onlySelf: true });

      } else if (control instanceof FormGroup) {
      	// Es un FormGroup, llamada recursiva para validar sus campos       
        this.validateAllFormFields(control); 

      }

    });
  }

  // Se cambia el valor de todas las checkboxes en un FormArray al valor recibido
  selectAllCheckboxes(formArray: FormArray, value: boolean) {
    // Se cambian valores
    for(var i=0; i < formArray.length; i++){
      formArray.controls[i].setValue(value);
    }

    // Se marca como "Touced" para provocar validación
    formArray.markAsTouched({ onlySelf: true });
  }

  // Valida forma con RegExp
  regExValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const constraint = nameRe.test(control.value);
    return constraint ?  null : {'constraint': {value: control.value}};
  };
}

}