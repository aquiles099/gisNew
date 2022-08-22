import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matchValue'
})
export class MatchValuePipe implements PipeTransform {

  transform(array: Array<any>, value:string|number, key?:string): Array<any>
  {
    return ! value ? array : array.filter(item => {
      
      value = value.toString().trim().toLowerCase();

      if(
        key &&
        typeof item === "object" &&
        item !== null && 
        item.hasOwnProperty(key)
      )
      {
        return item[key].toLowerCase().includes(value);
      }
      else
      {
        return item.toString().toLowerCase().includes(value);
      }
    
    });
  }

}
