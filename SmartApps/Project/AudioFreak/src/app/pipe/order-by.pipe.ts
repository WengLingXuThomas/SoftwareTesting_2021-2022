import { Pipe, PipeTransform } from '@angular/core';
//Aangeven dat dit gebruikt wordt als pipe
@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  //Gaat elk "field" in de meegegeven array sorteren, en dan de getransformeerde array terugsturen 
  transform(array: any, field: string): any[] {
    array.sort((a: any, b: any) => {
      if (a[field].toLowerCase() < b[field].toLowerCase()) {
        return -1;
      } else if (a[field].toLowerCase() > b[field].toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

