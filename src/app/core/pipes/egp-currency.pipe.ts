import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'egpCurrency',
  standalone: true
})
export class EgpCurrencyPipe implements PipeTransform {

  transform(value: number): string {
    const formattedValue = new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(value);
    return 'LE ' + formattedValue.replace('EGP', '').trim();
  }

}
