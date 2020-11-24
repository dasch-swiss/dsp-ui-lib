import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLineModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MockResource, ReadResourceSequence } from '@dasch-swiss/dsp-js';
import { ResourceListComponent } from './resource-list.component';

/**
 * Mocked truncate pipe from action module.
 */
@Pipe({name: 'dspTruncate'})
class MockPipe implements PipeTransform {
    transform(value: string, limit?: number, trail?: string): string {
        //Do stuff here, if you want
        return value;
    }
}

/**
 * Test parent component to simulate integration of resource-list component.
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

        MockResource.getTestThings(5).subscribe(res => {
            this.resources = res;
        });
    }

    openResource(id: string) {
        this.resIri = id;
    }

}

describe('ResourceListComponent', () => {
    let testHostComponent: TestParentComponent;
    let testHostFixture: ComponentFixture<TestParentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MockPipe,
                ResourceListComponent,
                TestParentComponent
            ],
            imports: [
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

    it('expect 5 resources', () => {
        expect(testHostComponent.resources).toBeTruthy();
        expect(testHostComponent.resources.resources.length).toBe(5);
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
