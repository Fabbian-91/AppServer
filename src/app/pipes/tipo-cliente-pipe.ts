import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoCliente',
})
export class TipoClientePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
