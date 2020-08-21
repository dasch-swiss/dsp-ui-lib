import { TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from './safe.pipe';

describe('SafePipe', () => {

    let pipe: SafePipe;
    let sanitizer: DomSanitizer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule
            ]
        });

        sanitizer = TestBed.inject(DomSanitizer);
        pipe = new SafePipe(sanitizer);
      });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });
});
