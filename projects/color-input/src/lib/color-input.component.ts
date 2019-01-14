import { Component, OnInit, OnChanges, SimpleChanges, Input, DoCheck, Output, EventEmitter } from '@angular/core';
import * as tinycolor from 'tinycolor2';
import { ValidationErrors, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ColorInputChangeEvent } from './color-input-change-event';

@Component({
  selector: 'color-input',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss']
})
export class ColorInputComponent implements OnInit, OnChanges, DoCheck {
    @Input() value: string;
    @Input() disabled: boolean;
    @Input() name: string;
    @Input() group: FormGroup;

    @Output() update: EventEmitter<ColorInputChangeEvent> = new EventEmitter<ColorInputChangeEvent>();

    control: FormControl;
    private isDown: boolean;
    private lightness: number;
    private saturation: number;
    private hue: number;
    swatch: object;
    grid: object;
    pointer: object;
    slider: object;
    showColorPicker = false;
    readonly hueSpectrum: number = 3.6; // hue is measured from 0 to 360, 3.6 is used to calculate that
    readonly sliderCenter: number = 3; // center point of the sliders css height
    readonly pointerCenter: number = 5; // center point of the pointers css height

    constructor() {
        // pass
    }

    ngOnInit(): void {
        this.control = new FormControl(
            { value: this.value, disabled: this.disabled },
            [Validators.maxLength(6), Validators.pattern(/^[0-9a-fA-F]{6}$/)]
        );

        if (this.group) {
            this.group.setControl(this.name, this.control);
        }

        this.setColorPicker(this.value, true);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log()
        // if (this.cloneModel !== this.model && !this.isDown) {
        //     this.setColorPicker(this.model, true);
        // }
    }

    ngDoCheck(): void {
        if (this.control.disabled !== this.disabled) {
            this.disabled ? this.control.disable() : this.control.enable();
        }
    }

    private setColorPicker(color: string, setHue?: boolean): void {
        console.log(color, this.control, tinycolor(color).isLight());
        this.control.setValue(color.toUpperCase());

        const {s, v, h} = tinycolor(color).toHsv();
        this.saturation = s * 100;
        this.lightness = v * 100;
        this.hue = setHue ? h : this.hue;
        const swatch: object = {'background-color': `#${color}` };

        this.swatch = tinycolor(color).isLight() ? {
                ...swatch,
                'border': `1px solid ${tinycolor(tinycolor(color).darken(10)).desaturate(30).toString()}`
            } : {...swatch, 'border': `1px solid #${color}`};
        this.grid = {
                'background-color': tinycolor({
                    h: this.hue,
                    s: 100,
                    v: 100
                }).toRgbString()
            };
        this.pointer = {
                ...swatch,
                'left.px': this.saturation - this.pointerCenter,
                'bottom.px': this.lightness - this.pointerCenter,
            };
        this.slider = setHue ?
            { ...this.grid, 'top.px': this.hueSpace(this.hue) - this.sliderCenter } :
            { ...this.slider };
    }

    toggleColorPicker(): void {
        this.showColorPicker = !this.showColorPicker;
    }

    isMouseDown(event: MouseEvent): void {
        // console.log(event);
        this.isDown = event.type === 'mousedown';
    }

    movePointer(event: MouseEvent): void {
        // console.log(event);
        if (this.isDown || event.type === 'click') {
            this.setColorPicker(
                tinycolor({
                    h: this.hue,
                    s: this.ensureZero(event.offsetX),
                    v: this.ensureZero(100 - event.offsetY)
                }).toHex()
            );

            this.update.emit(
                new ColorInputChangeEvent(
                    this.name,
                    this.value,
                    event
                )
            );
        }
    }

    moveSlider(event: MouseEvent): void {
        if (this.isDown || event.type === 'click') {
            const y: number = event.offsetY;
            this.hue = Math.round((100 - y) * this.hueSpectrum);
            this.setColorPicker(tinycolor({
                    h: this.hue,
                    s: this.saturation,
                    v: this.lightness
                }).toHex());
            this.slider = { ...this.grid, 'top.px': y - this.sliderCenter };

            this.update.emit(
                new ColorInputChangeEvent(
                    this.name,
                    this.value,
                    event
                )
            );
        }
    }

    change(event: any): void {
        console.log(event, this.control.value, this.value);
        this.setColorPicker(this.control.value, true);

        this.update.emit(
            new ColorInputChangeEvent(
                this.name,
                this.control.value,
                event
            )
        );
    }

    private hueSpace(goal: number): number {
        return Array.from(Array(100))
            .map((value: number, index: number): number => index * this.hueSpectrum)
            .reverse()
            .reduce((prev: number, curr: number, index: number): number =>
                (curr - this.hueSpectrum) < goal && (curr + this.hueSpectrum) > goal
                || curr === goal ? index : prev
            );
    }

    private ensureZero(num: number): number {
        // prevents flickering when pointer gets to the edges
        return num < 2 ? 0 : num;
    }

    // get hasError(): boolean {
    //     return this.formService.isInvalid(this.elementName, this.form.$$controls, 'hex');
    // }

}
