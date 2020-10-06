import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { Constants } from '@dasch-swiss/dsp-js';

@Directive({
    selector: '[dspMarkup]'
})
export class TextValueHtmlLinkDirective {

    @Output() internalLinkClicked = new EventEmitter<string>();
    @Output() internalLinkHovered = new EventEmitter<string>();

    constructor() {
    }

    @HostListener('click', ['$event.target'])
    onClick(targetElement) {
        if (targetElement.nodeName.toLowerCase() === 'a'
            && targetElement.className.toLowerCase().indexOf(Constants.SalsahLink) !== -1) {
            this.internalLinkClicked.emit(targetElement.href);
            return false;
        }
    }

    @HostListener('mouseover', ['$event.target'])
    onMouseEnter(targetElement) {
        if (targetElement.nodeName.toLowerCase() === 'a'
            && targetElement.className.toLowerCase().indexOf(Constants.SalsahLink) !== -1) {
            this.internalLinkHovered.emit(targetElement.href);
            return false;
        }
    }

}
