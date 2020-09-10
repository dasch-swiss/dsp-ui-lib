import { Component, OnInit } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReadIntValue } from '@dasch-swiss/dsp-js';
import { ConfirmationMessageComponent } from './confirmation-message.component';

/**
 * Test host component to simulate parent component with a confirmation dialog.
 */
@Component({
    template: `<dsp-confirmation-message [value]="testValue"></dsp-confirmation-message>`
})
class ConfirmationMessageTestHostComponent implements OnInit {

    testValue: ReadIntValue;

    constructor() {
    }

    ngOnInit() {
        this.testValue = new ReadIntValue();
        this.testValue.strval = '1';
        this.testValue.propertyLabel = 'My label';
        this.testValue.valueCreationDate = '1993-10-10T19:11:00.00Z';
        this.testValue.valueHasComment = 'My comment';
    }
}

describe('ConfirmationMessageComponent', () => {
    let testHostComponent: ConfirmationMessageTestHostComponent;
    let testHostFixture: ComponentFixture<ConfirmationMessageTestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfirmationMessageTestHostComponent,
                ConfirmationMessageComponent
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(ConfirmationMessageTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
    });

    it('should bind the values correctly', () => {
        const hostCompDe = testHostFixture.debugElement;
        const valueComponentDe = hostCompDe.query(By.directive(ConfirmationMessageComponent));

        expect(valueComponentDe).toBeTruthy();

        const label = valueComponentDe.query(By.css('.val-label')).nativeElement;
        expect(label.innerText).toEqual('Confirming this action will delete the following value from My label:');

        const value = valueComponentDe.query(By.css('.val-value')).nativeElement;
        expect(value.innerText).toEqual('Value: 1');

        const comment = valueComponentDe.query(By.css('.val-comment')).nativeElement;
        expect(comment.innerText).toEqual('Value Comment: My comment');

        const creationDate = valueComponentDe.query(By.css('.val-creation-date')).nativeElement;
        expect(creationDate.innerText).toEqual('Value Creation Date: 1993-10-10T19:11:00.00Z');

    });

    it('should default to "no comment" if the value does not contain a comment', () => {
        testHostComponent.testValue.valueHasComment = null;
        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;
        const valueComponentDe = hostCompDe.query(By.directive(ConfirmationMessageComponent));

        expect(valueComponentDe).toBeTruthy();

        const comment = valueComponentDe.query(By.css('.val-comment')).nativeElement;
        expect(comment.innerText).toEqual('Value Comment: No comment');

    });
});
