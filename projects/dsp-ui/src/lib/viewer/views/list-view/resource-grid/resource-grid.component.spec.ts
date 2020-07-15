import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MockResource, ReadResourceSequence } from '@dasch-swiss/dsp-js';
import { DspActionModule } from 'projects/dsp-ui/src/lib/action';
import { ResourceGridComponent } from './resource-grid.component';


/**
 * Test host component to simulate child component, here resource-grid.
 */
@Component({
    selector: `dsp-resource-grid`,
    template: ``
})
class TestResourceGridComponent {

    @Input() resources: ReadResourceSequence;

}

/**
 * Test host component to simulate resource-grid component.
 */
@Component({
    template: `
      <dsp-resource-grid #resGrid [resources]="resources" (resourceSelected)="openResource($event)"></dsp-resource-grid>`
})
class TestParentComponent implements OnInit {

    @ViewChild('resGrid') resourceGridComponent: ResourceGridComponent;

    resources: ReadResourceSequence;

    resIri: string;

    ngOnInit() {

        MockResource.getTesthings(5).subscribe(res => {
            this.resources = res;
        });
    }

    openResource(id: string) {
        console.log(id);
        this.resIri = id;
    }

}

describe('ResourceGridComponent', () => {
    let testHostComponent: TestParentComponent;
    let testHostFixture: ComponentFixture<TestParentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ResourceGridComponent,
                TestParentComponent
            ],
            imports: [
                DspActionModule,
                MatCardModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestParentComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
    });

    it('expect 5 resources', () => {
        expect(testHostComponent.resources).toBeTruthy();
        expect(testHostComponent.resources.resources.length).toBe(5);
    });

    it('should open first resource', () => {
        // trigger the click
        const nativeElement = testHostFixture.nativeElement;
        const item = nativeElement.querySelector('mat-card');
        item.dispatchEvent(new Event('click'));

        spyOn(testHostComponent, 'openResource').call('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');
        expect(testHostComponent.openResource).toHaveBeenCalled();
        expect(testHostComponent.openResource).toHaveBeenCalledTimes(1);

        // console.log('resIri', testHostComponent.resources.resources[0].id);
        // console.log('resIri', testHostComponent.resIri);
        expect(testHostComponent.resources.resources[0].id).toEqual('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');
        // expect(testHostComponent.resIri).toEqual('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');

    });

});
