import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { StatusMsg } from '../../../assets/i18n/statusMsg';
import { DspMessageData, MessageComponent } from './message.component';

/**
 * Test host component to simulate parent component with a progress bar.
 */
@Component({
    template: `<dsp-message #message [message]="shortMessage" [short]="short"></dsp-message>`
})
class TestHostComponent implements OnInit {

    @ViewChild('message', { static: false }) messageComponent: MessageComponent;

    shortMessage: DspMessageData = {
        status: 200,
        statusMsg: 'Success',
        statusText: 'You just updated the user profile.',
        type: 'Note',
        footnote: 'Close it'
    };

    short = true;

    constructor() {
    }

    ngOnInit() { }
}

describe('MessageComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let status: StatusMsg;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            MatCardModule,
            MatIconModule,
            MatListModule,
            RouterTestingModule
        ],
        providers: [
            StatusMsg
        ],
        declarations: [
            MessageComponent,
            TestHostComponent
        ]
    }).compileComponents();

    status = TestBed.inject(StatusMsg);

}));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
  });

  it('should create', () => {
    expect(testHostComponent.messageComponent).toBeTruthy();
  });

  it('should display a short message', () => {
    expect(testHostComponent.messageComponent).toBeTruthy();
    expect(testHostComponent.messageComponent.message.status).toEqual(200);
    expect(testHostComponent.messageComponent.message.statusMsg).toEqual('Success');

    const hostCompDe = testHostFixture.debugElement;

    const messageEl = hostCompDe.query(By.directive(MessageComponent));

    const spanShortMessageElement = messageEl.query(By.css('.dsp-short-message-text'));

    expect(spanShortMessageElement.nativeElement.innerText).toEqual('You just updated the user profile.');

  });
});
