import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorInputComponent } from './color-input.component';
import { CommonModule } from '../../../../node_modules/@angular/common';

@NgModule({
    declarations: [
        ColorInputComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [ColorInputComponent]
})
export class ColorInputModule { }
