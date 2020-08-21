import { TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { SanitizeUrlPipe } from './sanitize-url.pipe';

describe('SanitizeUrlPipe', () => {
    let pipe: SanitizeUrlPipe;
    let sanitizer: DomSanitizer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule
            ]
        });

        sanitizer = TestBed.inject(DomSanitizer);
        pipe = new SanitizeUrlPipe(sanitizer);
      });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });
});
