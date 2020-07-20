import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Region, StillImageComponent, StillImageRepresentation } from './still-image.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Constants, ReadGeomValue, ReadResource } from '@dasch-swiss/dsp-js';
import { By } from '@angular/platform-browser';
// TODO: get test data from dsp-js
import { ParseReadGeomValue } from '@dasch-swiss/dsp-js/src/models/v2/resources/values/read/read-geom-value';


// TODO: get this from dsp-js
const stillImageFileValue = {"type":"http://api.knora.org/ontology/knora-api/v2#StillImageFileValue","id":"http://rdfh.ch/0803/00014b43f902/values/18dc0912cd05","attachedToUser":"http://rdfh.ch/users/91e19f1e01","arkUrl":"http://0.0.0.0:3336/ark:/72163/1/0803/00014b43f902l/000000000018dc0912cd0wl","versionArkUrl":"http://0.0.0.0:3336/ark:/72163/1/0803/00014b43f902l/000000000018dc0912cd0wl.20121121T165038Z","valueCreationDate":"2012-11-21T16:50:38Z","hasPermissions":"CR knora-admin:Creator|M knora-admin:ProjectMember|V knora-admin:KnownUser|RV knora-admin:UnknownUser","userHasPermission":"RV","uuid":"000000000018dc0912cd0w","filename":"incunabula_0000003328.jp2","fileUrl":"http://0.0.0.0:1024/0803/incunabula_0000003328.jp2/full/1312,1815/0/default.jpg","dimX":1312,"dimY":1815,"iiifBaseUrl":"http://0.0.0.0:1024/0803","strval":"http://0.0.0.0:1024/0803/incunabula_0000003328.jp2/full/1312,1815/0/default.jpg","property":"http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue","propertyLabel":"has image file","propertyComment":"Connects a Representation to an image file"};

// TODO: remove dummy region
const rectangleGeom
    = '{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.0989010989010989,"y":0.18055555555555555},{"x":0.7252747252747253,"y":0.7245370370370371}],"type":"rectangle"}';

const polygonGeom
    = '{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.17532467532467533,"y":0.18049792531120332},{"x":0.8051948051948052,"y":0.17012448132780084},{"x":0.8311688311688312,"y":0.7261410788381742},{"x":0.19480519480519481,"y":0.7323651452282157},{"x":0.17857142857142858,"y":0.17842323651452283},{"x":0.18506493506493507,"y":0.1825726141078838},{"x":0.17857142857142858,"y":0.1825726141078838}],"type":"polygon"}';

function makeRegion(geomString: string[], iri: string): ReadResource {

    const geomVals = geomString.map(geom => {
        const parseReg = new ParseReadGeomValue();
        parseReg.geometryString = geom;

        return new ReadGeomValue(parseReg);
    });

    const regionRes = new ReadResource();
    regionRes.id = iri;
    regionRes.properties[Constants.HasGeometry] = geomVals;

    return regionRes;
}

@Component({
    template: `
        <dsp-still-image [images]="stillImageFileRepresentations"
                         [imageCaption]="caption">
        </dsp-still-image>`
})
class TestHostComponent implements OnInit {
    stillImageFileRepresentations: StillImageRepresentation[] = [];
    caption = 'test image';

    @ViewChild(StillImageComponent) osdViewerComp: StillImageComponent;

    ngOnInit() {

        this.stillImageFileRepresentations = [new StillImageRepresentation(stillImageFileValue, [new Region(makeRegion([rectangleGeom], 'first')), new Region(makeRegion([polygonGeom], 'second'))])];
    }
}

describe('StillImageComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StillImageComponent, TestHostComponent],
            imports: [
                MatIconModule,
                MatToolbarModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();
    });

    it('should create', () => {
        expect(testHostComponent).toBeTruthy();
        expect(testHostComponent.osdViewerComp).toBeTruthy();
    });

    // atm StillImageOSDViewerComponent has not many public methods or members.
    // to be able to still test state of StillImageOSDViewerComponent we use the following technique for the first couple of tests:
    // test private methods, members with: component["method"](param), or component["member"]
    // this prevents TS compiler from restricting access, while still checking type safety.

    it('should have initialized viewer after resources change', () => {
        expect(testHostComponent.osdViewerComp['_viewer']).toBeTruthy();
    });

    it('should have OpenSeadragon.Viewer.isVisible() == true after resources change', () => {
        expect(testHostComponent.osdViewerComp['_viewer'].isVisible()).toBeTruthy();
    });

    it('should have 1 image loaded after resources change with 1 full size image', done => {

        testHostComponent.osdViewerComp['_viewer'].addHandler('open', (args) => {
            expect(testHostComponent.osdViewerComp['_viewer'].world.getItemCount()).toEqual(1);
            done();
        });

    });

    it ('should display the image caption', () => {

        const hostCompDe = testHostFixture.debugElement;
        const stillImageComponentDe = hostCompDe.query(By.directive(StillImageComponent));

        const captionDebugElement = stillImageComponentDe.query(By.css('.mat-caption'));
        const captionEle = captionDebugElement.nativeElement;

        expect(captionEle.innerText).toEqual('test image');

    });

});
