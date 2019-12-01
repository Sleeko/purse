import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export class CustomValidators {

    static ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
        if (control.value != null) {
            let birthDate = new Date(control.value);
            let age = moment().diff(birthDate, 'years');
            if(age<18) {
                return { 'ageInvalid': true };
            }
        }
        return null;
    }

}
