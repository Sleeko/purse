import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSeller'
})
export class FilterSellerPipe implements PipeTransform {

  transform(value: any[], searchText: string): any {
    if(searchText==null || searchText=='') {
      return value;
    } else {
      let finalVal =  value.filter(val=> val.name.toLowerCase().includes(searchText));
      return finalVal;
    }
  }

}
