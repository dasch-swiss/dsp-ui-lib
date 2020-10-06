import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ExternalLinksDirective } from './external-links.directive';

@Component({
    template: `<a href="http://dasch.swiss/">{{ label }}</a>`
})
class TestExternalLinkComponent {

    label = 'DaSCH website';

    constructor() { }
}

describe('ExternalLinksDirective', () => {

    let component: TestExternalLinkComponent;
    let fixture: ComponentFixture<TestExternalLinkComponent>;
    let linkEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ExternalLinksDirective,
                TestExternalLinkComponent
            ]
        });

        fixture = TestBed.createComponent(TestExternalLinkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        linkEl = fixture.debugElement.query(By.css('a[href]'));

    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('should get the correct attributes', () => {
        let relAttribute;
        let targetAttribute;
        let hrefAttribute;

        relAttribute = linkEl.attributes.rel;
        targetAttribute = linkEl.attributes.target;
        hrefAttribute = linkEl.attributes.href;

        expect(relAttribute).toEqual('noopener');
        expect(targetAttribute).toEqual('_blank');
        expect(hrefAttribute).toEqual('http://dasch.swiss/');
    });
});
