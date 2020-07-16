import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StillImageComponent } from './still-image.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReadStillImageFileValue } from '@dasch-swiss/dsp-js';
import { By } from '@angular/platform-browser';

// TODO: get this from dsp-js
const stillImageFileValue = {"type":"http://api.knora.org/ontology/knora-api/v2#StillImageFileValue","id":"http://rdfh.ch/0803/00014b43f902/values/18dc0912cd05","attachedToUser":"http://rdfh.ch/users/91e19f1e01","arkUrl":"http://0.0.0.0:3336/ark:/72163/1/0803/00014b43f902l/000000000018dc0912cd0wl","versionArkUrl":"http://0.0.0.0:3336/ark:/72163/1/0803/00014b43f902l/000000000018dc0912cd0wl.20121121T165038Z","valueCreationDate":"2012-11-21T16:50:38Z","hasPermissions":"CR knora-admin:Creator|M knora-admin:ProjectMember|V knora-admin:KnownUser|RV knora-admin:UnknownUser","userHasPermission":"RV","uuid":"000000000018dc0912cd0w","filename":"incunabula_0000003328.jp2","fileUrl":"http://0.0.0.0:1024/0803/incunabula_0000003328.jp2/full/1312,1815/0/default.jpg","dimX":1312,"dimY":1815,"iiifBaseUrl":"http://0.0.0.0:1024/0803","strval":"http://0.0.0.0:1024/0803/incunabula_0000003328.jp2/full/1312,1815/0/default.jpg","property":"http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue","propertyLabel":"has image file","propertyComment":"Connects a Representation to an image file"};

@Component({
    template: `
        <dsp-still-image [images]="stillImageFileValues"
                         [imageCaption]="caption">
        </dsp-still-image>`
})
class TestHostComponent implements OnInit {
    stillImageFileValues: ReadStillImageFileValue[] = [];
    caption = 'test image';

    @ViewChild(StillImageComponent) osdViewerComp: StillImageComponent;

    ngOnInit() {
        this.stillImageFileValues = [stillImageFileValue as ReadStillImageFileValue];
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
