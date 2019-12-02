import { NgModule } from '@angular/core';
import { BlockSpecialCharDirective } from './block-special-char.directive';
import { DisableFormControlDirective } from './disable-form-control.directive';
import { PhoneMaskDirective } from './phone-mask.directive';



@NgModule({
    imports: [
    ],
    declarations: [
        BlockSpecialCharDirective,
        DisableFormControlDirective,
        PhoneMaskDirective
    ],
    exports: [
        BlockSpecialCharDirective,
        DisableFormControlDirective,
        PhoneMaskDirective
    ]
})
export class DirectivesModule { }
