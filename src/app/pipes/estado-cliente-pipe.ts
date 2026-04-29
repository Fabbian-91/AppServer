import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoCliente',
})
export class EstadoClientePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
