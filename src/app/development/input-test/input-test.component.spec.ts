import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTestComponent } from './input-test.component';
import { Component, OnInit, ViewChild } from '@angular/core';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <app-input-test #testComp [myFirstInput]="'dada'"></app-input-test>`
})
class TestHostComponent1 implements OnInit {

    @ViewChild('testComp') testComponent: InputTestComponent;

    ngOnInit() {

    }
}

describe('InputTestComponent', () => {
    let component: TestHostComponent1;
    let fixture: ComponentFixture<TestHostComponent1>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InputTestComponent, TestHostComponent1]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent1);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();

        expect(component.testComponent).toBeTruthy();
        expect(component.testComponent.myFirstInput).toEqual('dada');
        expect(component.testComponent.mySecondInput).toEqual('hi');
        expect(component.testComponent.myThirdInput).toEqual(undefined);
    });
});
