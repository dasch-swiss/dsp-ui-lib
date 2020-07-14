import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLineModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MockResource, ReadResourceSequence } from '@dasch-swiss/dsp-js';
import { DspActionModule } from 'projects/dsp-ui/src/lib/action';
import { ResourceListComponent } from './resource-list.component';

/**
 * Test host component to simulate child component, here property-view.
 */
@Component({
    selector: `dsp-resource-list`,
    template: ``
})
class TestResourceListComponent {

    @Input() resources: ReadResourceSequence;

}

/**
 * Test host component to simulate resource-list component.
 */
@Component({
    template: `
      <dsp-resource-list #resList [resources]="resources" (resourceSelected)="openResource($event)"></dsp-resource-list>`
})
class TestParentComponent implements OnInit {

    @ViewChild('resList') resourceListComponent: ResourceListComponent;

    resources: ReadResourceSequence;

    resIri: string;

    ngOnInit() {

        MockResource.getTesthings().subscribe(res => {
            this.resources = res;
        });
    }

    openResource(id: string) {
        this.resIri = id;
    }

}

fdescribe('ResourceListComponent', () => {
    let testHostComponent: TestParentComponent;
    let testHostFixture: ComponentFixture<TestParentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ResourceListComponent,
                TestParentComponent
            ],
            imports: [
                DspActionModule,
                MatIconModule,
                MatLineModule,
                MatListModule
            ],
            providers: []
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestParentComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
    });

    it('expect 2 resources', () => {
        expect(testHostComponent.resources).toBeTruthy();
        expect(testHostComponent.resources.resources.length).toBe(25);
    });

    it('should open first resource', () => {
        // trigger the click
        const nativeElement = testHostFixture.nativeElement;
        const item = nativeElement.querySelector('mat-list-item');
        item.dispatchEvent(new Event('click'));

        spyOn(testHostComponent, 'openResource').call('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');
        expect(testHostComponent.openResource).toHaveBeenCalled();
        expect(testHostComponent.openResource).toHaveBeenCalledTimes(1);

        expect(testHostComponent.resIri).toEqual('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');

    });

});
