import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchListValueComponent } from './search-list-value.component';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ListNodeV2, ListsEndpointV2, MockList, MockOntology, ResourcePropertyDefinition } from '@dasch-swiss/dsp-js';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DspApiConnectionToken } from '../../../../../core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { of } from 'rxjs';
import { IRI } from '../operator';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <dsp-search-list-value #listVal [formGroup]="form" [property]="property"></dsp-search-list-value>`
})
class TestHostComponent implements OnInit {

    form;

    property: ResourcePropertyDefinition;

    @ViewChild('listVal', { static: false }) listValue: SearchListValueComponent;

    constructor(@Inject(FormBuilder) private _fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this._fb.group({});

        const anythingOnto = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2');
        this.property = anythingOnto.properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem'] as ResourcePropertyDefinition;
    }
}

/**
 * Test component to simulate date value component.
 */
@Component({
    selector: 'dsp-search-display-list',
    template: `<mat-menu #childMenu="matMenu" [overlapTrigger]="false"></mat-menu>`
})
class TestSearchDisplayListComponent implements OnInit {

    @Input() children: ListNodeV2[];

    @Output() selectedNode: EventEmitter<ListNodeV2> = new EventEmitter<ListNodeV2>();

    @ViewChild('childMenu', { static: true }) public childMenu: MatMenu;

    ngOnInit() {

    }

}

describe('SearchListValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    let loader: HarnessLoader;

    beforeEach(async(() => {

        const listSpyObj = {
            v2: {
                list: jasmine.createSpyObj('list', ['getList'])
            }
        };

        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatMenuModule,
                MatInputModule
            ],
            declarations: [
                SearchListValueComponent,
                TestHostComponent,
                TestSearchDisplayListComponent
            ],
            providers: [
                {
                    provide: DspApiConnectionToken,
                    useValue: listSpyObj
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        const listSpy = TestBed.inject(DspApiConnectionToken);

        (listSpy.v2.list as jasmine.SpyObj<ListsEndpointV2>).getList.and.callFake(
            (rootListNodeIri) => {
                return of(MockList.mockList('http://rdfh.ch/lists/0001/treeList'));
            }
        );

        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(testHostFixture);

        testHostFixture.detectChanges();
    });

    it('should create', () => {
        const dspSpy = TestBed.inject(DspApiConnectionToken);

        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.listValue).toBeTruthy();

        expect(testHostComponent.listValue.listRootNode).toBeDefined();
        expect(testHostComponent.listValue.listRootNode.isRootNode).toBe(true);

        expect(dspSpy.v2.list.getList).toHaveBeenCalledTimes(1);
        expect(dspSpy.v2.list.getList).toHaveBeenCalledWith('http://rdfh.ch/lists/0001/treeList');

    });

    it('should emit the selected node', async () => {

        const button = await loader.getHarness(MatButtonHarness);

        expect(await button.getText()).toEqual('Select list value');

        await button.click();

        const hostCompDe = testHostFixture.debugElement;
        const searchDisplayListComponent = hostCompDe.query(By.directive(TestSearchDisplayListComponent));

        expect(searchDisplayListComponent).not.toBeNull();

        const listNode = new ListNodeV2();
        listNode.id = 'http://rdfh.ch/lists/0001/treeList03';

        (searchDisplayListComponent.componentInstance as TestSearchDisplayListComponent).selectedNode.emit(listNode);

        expect(testHostComponent.listValue.form.controls['listValue'].value).toEqual('http://rdfh.ch/lists/0001/treeList03');

    });

    it('should get the selected list node', () => {

        testHostComponent.listValue.form.controls['listValue'].setValue('http://rdfh.ch/lists/0001/treeList/01');

        const expectedListNode = new IRI('http://rdfh.ch/lists/0001/treeList/01');

        const listNode = testHostComponent.listValue.getValue();

        expect(listNode).toEqual(expectedListNode);

    });
});
