import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[dspMarkup]'
})
export class TextValueLinkDirective {

    constructor() {
    }

    @HostListener('click', ['$event.target'])
    onClick(targetElement) {
        console.log(targetElement);
        // TODO: detect interal links (salsah-link class)
        return false;
    }

}
