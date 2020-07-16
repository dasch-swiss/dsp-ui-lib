import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { ReadStillImageFileValue } from '@dasch-swiss/dsp-js';

// This component needs the openseadragon library itself, as well as the openseadragon plugin openseadragon-svg-overlay
// Both libraries are installed via package.json, and loaded globally via the script tag in .angular-cli.json

// OpenSeadragon does not export itself as ES6/ECMA2015 module,
// it is loaded globally in scripts tag of angular-cli.json,
// we still need to declare the namespace to make TypeScript compiler happy.
declare let OpenSeadragon: any;

@Component({
    selector: 'dsp-still-image',
    templateUrl: './still-image.component.html',
    styleUrls: ['./still-image.component.scss']
})
export class StillImageComponent implements OnChanges, OnDestroy {

    @Input() images: ReadStillImageFileValue[];
    @Input() imageCaption?: string;

    private _viewer;

    constructor(private _elementRef: ElementRef) {
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        if (changes['images'] && changes['images'].isFirstChange()) {
            this._setupViewer();
            // this.currentImageIri.emit(this.images[this._viewer.currentPage()].stillImageFileValue.id);
        }
        if (changes['images']) {
            this._openImages();
            // this.renderRegions();
            // this.unhighlightAllRegions();
            /*if (this.activateRegion !== undefined) {
                this.highlightRegion(this.activateRegion);
            }*/
        } else if (changes['activateRegion']) {
            /*this.unhighlightAllRegions();
            if (this.activateRegion !== undefined) {
                this.highlightRegion(this.activateRegion);
            }*/
        }
    }

    ngOnDestroy() {
        if (this._viewer) {
            this._viewer.destroy();
            this._viewer = undefined;
        }
    }

    /**
     * Renders all ReadStillImageFileValues to be found in [[this.images]].
     * (Although this.images is a Angular Input property, the built-in change detection of Angular does not detect changes in complex objects or arrays, only reassignment of objects/arrays.
     * Use this method if additional ReadStillImageFileValues were added to this.images after creation/assignment of the this.images array.)
     */
    updateImages() {
        if (!this._viewer) {
            this._setupViewer();
        }
        this._openImages();
    }

    /**
     * Initializes the OpenSeadragon _viewer
     */
    private _setupViewer(): void {
        const viewerContainer = this._elementRef.nativeElement.getElementsByClassName('osd-container')[0];
        const osdOptions = {
            element: viewerContainer,
            sequenceMode: false,
            showReferenceStrip: true,
            showNavigator: true,
            zoomInButton: 'DSP_OSD_ZOOM_IN',
            zoomOutButton: 'DSP_OSD_ZOOM_OUT',
            /*previousButton: 'DSP_OSD_PREV_PAGE',
            nextButton: 'DSP_OSD_NEXT_PAGE',*/
            homeButton: 'DSP_OSD_HOME',
            fullPageButton: 'DSP_OSD_FULL_PAGE'/*,
            rotateLeftButton: 'DSP_OSD_ROTATE_LEFT',        // doesn't work yet
            rotateRightButton: 'DSP_OSD_ROTATE_RIGHT'*/       // doesn't work yet
        };
        this._viewer = new OpenSeadragon.Viewer(osdOptions);

        this._viewer.addHandler('full-screen', (args) => {
            if (args.fullScreen) {
                viewerContainer.classList.add('fullscreen');
            } else {
                viewerContainer.classList.remove('fullscreen');
            }
        });
        this._viewer.addHandler('resize', (args) => {
            // args.eventSource.svgOverlay().resize();
        });
    }

    /**
     * Adds all images in this.images to the _viewer.
     * Images are positioned in a horizontal row next to each other.
     */
    private _openImages(): void {
        // imageXOffset controls the x coordinate of the left side of each image in the OpenSeadragon viewport coordinate system.
        // The first image has its left side at x = 0, and all images are scaled to have a width of 1 in viewport coordinates.
        // see also: https://openseadragon.github.io/examples/viewport-coordinates/

        // display only the defined range of this.images
        const tileSources: object[] = this._prepareTileSourcesFromFileValues(this.images);

        // this.removeOverlays();
        this._viewer.open(tileSources);

    }

    /**
     * Prepare tile sources from the given sequence of [[ReadStillImageFileValue]].
     *
     * @param imagesToDisplay the given file values to de displayed.
     * @returns the tile sources to be passed to OSD _viewer.
     */
    private _prepareTileSourcesFromFileValues(imagesToDisplay: ReadStillImageFileValue[]): object[] {
        let imageXOffset = 0;
        const imageYOffset = 0;
        const tileSources = [];

        for (const image of imagesToDisplay) {
            const sipiBasePath = image.iiifBaseUrl + '/' + image.filename;
            const width = image.dimX;
            const height = image.dimY;

            // construct OpenSeadragon tileSources according to https://openseadragon.github.io/docs/OpenSeadragon.Viewer.html#open
            tileSources.push({
                // construct IIIF tileSource configuration according to
                // http://iiif.io/api/image/2.1/#technical-properties
                // see also http://iiif.io/api/image/2.0/#a-implementation-notes
                tileSource: {
                    '@context': 'http://iiif.io/api/image/2/context.json',
                    '@id': sipiBasePath,
                    height: height,
                    width: width,
                    profile: ['http://iiif.io/api/image/2/level2.json'],
                    protocol: 'http://iiif.io/api/image',
                    tiles: [{
                        scaleFactors: [1, 2, 4, 8, 16, 32],
                        width: 1024
                    }]
                },
                x: imageXOffset,
                y: imageYOffset
            });

            imageXOffset++;
        }

        return tileSources;
    }

}
