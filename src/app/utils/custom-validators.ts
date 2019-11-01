import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export class CustomValidators {

    static ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
        if (control.value != null) {
            let birthDate = new Date(control.value);
            let age = moment().diff(birthDate, 'years');
            console.log(age);
            if(age<18) {
                return { 'ageInvalid': true };
            }
        }
        return null;
    }

    // static dateMinimum(date: string): ValidatorFn {
    //     return (control: AbstractControl): ValidationErrors | null => {
    //       if (control.value == null) {
    //         return null;
    //       }
    
    //       const controlDate = moment(control.value, FORMAT_DATE);
    
    //       if (!controlDate.isValid()) {
    //         return null;
    //       }
    
    //       const validationDate = moment(date);
    
    //       return controlDate.isAfter(validationDate) ? null : {
    //         'date-minimum': {
    //           'date-minimum': validationDate.format(FORMAT_DATE),
    //           'actual': controlDate.format(FORMAT_DATE)
    //         }
    //       };
    //     };
    //   }
}
