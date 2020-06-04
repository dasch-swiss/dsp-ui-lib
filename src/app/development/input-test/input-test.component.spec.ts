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

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <app-input-test #testComp [mySecondInput]="'dudu'"></app-input-test>`
})
class TestHostComponent2 implements OnInit {

    @ViewChild('testComp') testComponent: InputTestComponent;

    ngOnInit() {

    }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <app-input-test #testComp [myThirdInput]="'aha'"></app-input-test>`
})
class TestHostComponent3 implements OnInit {

    @ViewChild('testComp') testComponent: InputTestComponent;

    ngOnInit() {

    }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <app-input-test #testComp [myFirstInput]="firstInput" [mySecondInput]="secondInput"></app-input-test>`
})
class TestHostComponent4 implements OnInit {

    firstInput = 'dada';
    secondInput = 'dudu';

    @ViewChild('testComp') testComponent: InputTestComponent;

    ngOnInit() {

    }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <app-input-test #testComp [myFirstInput]="firstInput" [mySecondInput]="secondInput" [myThirdInput]="thirdInput"></app-input-test>`
})
class TestHostComponent5 implements OnInit {

    firstInput = 'dada';
    secondInput = 'dudu';
    thirdInput = 'hihi';

    @ViewChild('testComp') testComponent: InputTestComponent;

    ngOnInit() {

    }
}

describe('InputTestComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                InputTestComponent,
                TestHostComponent1,
                TestHostComponent2,
                TestHostComponent3,
                TestHostComponent4,
                TestHostComponent5
            ]
        })
            .compileComponents();
    }));

    it('should create InputTestComponent using TestHostComponent1', () => {
        const fixture = TestBed.createComponent(TestHostComponent1);
        const component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component).toBeTruthy();

        expect(component.testComponent).toBeTruthy();
        expect(component.testComponent.myFirstInput).toEqual('dada');
        expect(component.testComponent.mySecondInput).toEqual('hi');
        expect(component.testComponent.myThirdInput).toEqual(undefined);
    });

    it('should create InputTestComponent using TestHostComponent2', () => {
        const fixture = TestBed.createComponent(TestHostComponent2);
        const component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component).toBeTruthy();

        expect(component.testComponent).toBeTruthy();
        expect(component.testComponent.myFirstInput).toEqual('oho');
        expect(component.testComponent.mySecondInput).toEqual('dudu');
        expect(component.testComponent.myThirdInput).toEqual(undefined);
    });

    it('should create InputTestComponent using TestHostComponent3', () => {
        const fixture = TestBed.createComponent(TestHostComponent3);
        const component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component).toBeTruthy();

        expect(component.testComponent).toBeTruthy();
        expect(component.testComponent.myFirstInput).toEqual('oho');
        expect(component.testComponent.mySecondInput).toEqual('hi');
        expect(component.testComponent.myThirdInput).toEqual('aha');
    });

    it('should create InputTestComponent using TestHostComponent4', () => {
        const fixture = TestBed.createComponent(TestHostComponent4);
        const component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component).toBeTruthy();

        expect(component.testComponent).toBeTruthy();
        expect(component.testComponent.myFirstInput).toEqual('dada');
        expect(component.testComponent.mySecondInput).toEqual('dudu');
        expect(component.testComponent.myThirdInput).toEqual(undefined);

        component.firstInput = 'gaga';

        fixture.detectChanges();

        expect(component.testComponent.myFirstInput).toEqual('gaga');
        expect(component.testComponent.mySecondInput).toEqual('dudu');
        expect(component.testComponent.myThirdInput).toEqual(undefined);

    });

    it('should create InputTestComponent using TestHostComponent5', () => {
        const fixture = TestBed.createComponent(TestHostComponent5);
        const component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component).toBeTruthy();

        expect(component.testComponent).toBeTruthy();
        expect(component.testComponent.myFirstInput).toEqual('dada');
        expect(component.testComponent.mySecondInput).toEqual('dudu');
        expect(component.testComponent.myThirdInput).toEqual('hihi');

        component.thirdInput = undefined;

        fixture.detectChanges();

        expect(component.testComponent.myFirstInput).toEqual('dada');
        expect(component.testComponent.mySecondInput).toEqual('dudu');
        expect(component.testComponent.myThirdInput).toEqual(undefined);

    });
});
