import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removedorComillas'
})
export class RemovedorComillasPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let realValue = value.split('"')[1];
    return realValue;
  }

}
