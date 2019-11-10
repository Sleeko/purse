import { NgModule } from '@angular/core';
import { BlockSpecialCharDirective } from './block-special-char.directive';
import { DisableFormControlDirective } from './disable-form-control.directive';



@NgModule({
    imports: [
    ],
    declarations: [
        BlockSpecialCharDirective,
        DisableFormControlDirective
    ],
    exports: [
        BlockSpecialCharDirective,
        DisableFormControlDirective
    ]
})
export class DirectivesModule { }
