export class ColorInputChangeEvent {
    name: string;
    value: string;
    event: KeyboardEvent | MouseEvent;

    constructor(name: string, value: string, event: KeyboardEvent | MouseEvent) {
        this.name = name;
        this.value = value;
        this.event = event;
    }
}
