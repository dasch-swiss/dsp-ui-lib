import { Directive, HostListener } from '@angular/core';
import { Constants } from '@dasch-swiss/dsp-js';

@Directive({
    selector: '[dspMarkup]'
})
export class TextValueXmlLinkDirective {

    constructor() {
    }

    @HostListener('click', ['$event.target'])
    onClick(targetElement) {
        if (targetElement.nodeName.toLowerCase() === 'a'
            && targetElement.className.toLowerCase().indexOf(Constants.SalsahLink) >= 0) {
            console.log('click', targetElement);
            return false;
        }
    }

    @HostListener('mouseover', ['$event.target'])
    onMouseEnter(targetElement) {
        if (targetElement.nodeName.toLowerCase() === 'a'
            && targetElement.className.toLowerCase().indexOf(Constants.SalsahLink) >= 0) {
            console.log('mouseover', targetElement);
            return false;
        }
    }

}
