import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safe'
})
export class SafePipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(value: string, type: string): SafeHtml | SafeUrl {
        switch (type) {
            case 'html': return this._sanitizer.bypassSecurityTrustHtml(value);
            case 'url': return this._sanitizer.bypassSecurityTrustUrl(value);
            default: throw new Error(`Invalid safe type specified: ${type}`);
        }
    }
}
