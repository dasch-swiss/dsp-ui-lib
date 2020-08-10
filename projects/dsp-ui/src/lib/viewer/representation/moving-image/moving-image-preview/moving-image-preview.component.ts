import { Component, OnInit, AfterViewInit, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AvInfo } from '../../av-helper/av-models/av-info';
import { MovingImagePreviewService } from './moving-image-preview.service';

@Component({
  selector: 'dsp-moving-image-preview',
  templateUrl: './moving-image-preview.component.html',
  styleUrls: ['./moving-image-preview.component.scss'],
  host: {
      '(mouseenter)': 'toggleFlipbook(true)',
      '(mouseleave)': 'toggleFlipbook(false)',
      '(mousemove)': 'updatePreviewByPosition($event)',
      '(click)': 'openVideo()'
  }
})
export class MovingImagePreviewComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() dispTime = false;

    /** needed video information: name and duration */
    @Input() video: AvInfo;

    /** show frame at the corresponding time */
    @Input() time?: number;

    @Output() open = new EventEmitter<{ video: string, time: number }>();

    focusOnPreview = false;

    // video information
    aspectRatio: number;

    // preview images are organized in matrix files;
    // we need the last number of those files and the number of lines from the last matrix file
    // we need the number of these files and the number of lines of the last matrix file
    // 1. matrix file name
    matrix: string;
    // 2. matrix dimension
    matrixWidth: number;
    matrixHeight: number;
    // 3. number of matrixes and number of lines of last file and number of last possible frame
    lastMatrixNr: number;
    lastMatrixLine: number;
    lastMatrixFrameNr: number;
    // 4. dimension of one frame inside the matrix
    matrixFrameWidth: number;
    matrixFrameHeight: number;

    // size of frame to be displayed; corresponds to dimension of parent container
    frameWidth: number;
    frameHeight: number;

    // proportion between matrix frame size and parent container size
    // to calculate matrix background size
    proportion: number;

    @ViewChild('frame') frame: ElementRef;

    constructor(
        private _host: ElementRef,
        private _matrix: MovingImagePreviewService
    ) { }

    ngOnInit(): void {

    }

    ngOnChanges() {
        this.time = this.time || (this.video.duration / 2);

        // this.matrix = environment.iiifUrl + this.video.id + '_m_0.jpg';

        if (!this.matrixFrameWidth && !this.matrixFrameHeight) {
            this.calculateSizes(this.matrix, false);
        }
        // TODO: update time from timeline
        // console.log('something has changed', this.time)
        if (this.frame) {
            this.updatePreviewByTime();
        }
        // this.calculateSizes();
        // this.frameHeight = this.element.nativeElement.clientHeight;
    }

    ngAfterViewInit() {

        // this.calculateSizes(this.matrix, false);

    }

    toggleFlipbook(active: boolean) {
        this.focusOnPreview = active;

        let i = 0;
        let j = 0;

        if (this.focusOnPreview) {
            // automatic playback of individual frames from first matrix
            // TODO: activate this later with an additional parameter (@Input) to switch between mousemove and automatic preview
            // this.autoPlay(i, j, false);

        } else {
            i = 0;
        }

    }

    autoPlay(i: number, j: number, sipi: boolean, delay: number = 250) {
        let iiifParams: string;
        let cssParams: string;
        let x = 0;
        let y = 0;

        setTimeout(() => {

            x = i * this.matrixFrameWidth;
            y = j * this.matrixFrameHeight;

            if (sipi) {
                iiifParams = x + ',' + y + ',' + this.matrixFrameWidth + ',' + this.matrixFrameHeight + '/' + this.frameWidth + ',' + this.frameHeight + '/0/default.jpg';
                const currentFrame: string = this.matrix + '/' + iiifParams;

                this.frame.nativeElement.style['background-image'] = 'url(' + currentFrame + ')';
            } else {
                cssParams = '-' + x + 'px -' + y + 'px';

                this.frame.nativeElement.style['background-position'] = cssParams;
            }

            i++;
            if (i < 6 && this.focusOnPreview) {
                this.autoPlay(i, j, sipi);
            } else {
                i = 0;
                j++;
                if (j < 6 && this.focusOnPreview) {
                    this.autoPlay(i, j, sipi);
                }
            }
        }, delay);
    }

    // to test the difference between sipi single image calculation and css background position,
    // this method has the additional parameter `sipi` as boolean value to switch between the two variants quite quick
    calculateSizes(image: string, sipi: boolean) {

        // host dimension
        let parentFrameWidth: number = this._host.nativeElement.offsetWidth;
        let parentFrameHeight: number = this._host.nativeElement.offsetHeight;

        this._matrix.getMatrixInfo(image + '/info.json').subscribe((res: any) => {
            // matrix dimension is:
            this.matrixWidth = res.width;
            this.matrixHeight = res.height;

            const lines: number = (this.video.duration > 360 ? 6 : Math.round(this.video.duration / 60));

            // get matrix frame dimension
            this.matrixFrameWidth = (this.matrixWidth / 6);
            this.matrixFrameHeight = (this.matrixHeight / lines);

            this.lastMatrixNr = Math.floor((this.video.duration - 10) / 360);

            this.proportion = (this.matrixFrameWidth / parentFrameWidth);

            if ((this.matrixFrameHeight / this.proportion) > parentFrameHeight) {
                this.proportion = (this.matrixFrameHeight / parentFrameHeight);
                // console.log('matrix frame height is to high', (this.proportion));
            } else {
                // console.log('matrix frame height is ok', (this.proportion));
            }

            this.frameWidth = Math.round(this.matrixFrameWidth / this.proportion);
            this.frameHeight = Math.round(this.matrixFrameHeight / this.proportion);

            if (sipi) {
                // calculate iiifParams / position, cutout-size (matrixFrameDimension) / display-size
                const iiifParams: string = '0,0,' + this.matrixFrameWidth + ',' + this.matrixFrameHeight + '/' + this.frameWidth + ',/0/default.jpg';
                const currentFrame: string = image + '/' + iiifParams;
                this.frame.nativeElement.style['background-image'] = 'url(' + currentFrame + ')';
                this.frame.nativeElement.style['background-size'] = this.frameWidth + 'px ' + this.frameHeight + 'px';
            } else {
                // background-image, -size
                this.frame.nativeElement.style['background-image'] = 'url(' + this.matrix + '/full/full/0/default.jpg)';
                this.frame.nativeElement.style['background-size'] = Math.round(this.matrixWidth / this.proportion) + 'px auto';
                // + Math.round(this.matrixHeight / this.proportion) + 'px';
            }

            this.frame.nativeElement.style['width'] = this.frameWidth + 'px';
            this.frame.nativeElement.style['height'] = this.frameHeight + 'px';

        });

    }

    updatePreviewByPosition(ev: MouseEvent) {

        let position: number = ev.offsetX;

        // one frame per 6 pixels
        if (Number.isInteger(position / 6)) {
            // calculate time from relative mouse position;
            this.time = (ev.offsetX / this._host.nativeElement.offsetWidth) * this.video.duration;

            this.updatePreviewByTime();
        }

    }

    updatePreviewByTime() {

        // overflow fixes
        if (this.time < 0) {
            this.time = 0;
        }
        if (this.time > this.video.duration) {
            this.time = this.video.duration;
        }

        // get current matrix image; one matrix contains 6 minute of the video
        let curMatrixNr: number = Math.floor(this.time / 360);

        if (curMatrixNr < 0) {
            curMatrixNr = 0;
        }

        // get current matrix file url; TODO: this will be handled by sipi
        // this.matrix = environment.iiifUrl + this.video.name + '_m_' + curMatrixNr;

        // the last matrix file could have another dimension size...
        if (curMatrixNr < this.lastMatrixNr) {
            this.matrixHeight = Math.round(this.frameHeight * 6);
            this.frame.nativeElement.style['background-size'] = Math.round(this.matrixWidth / this.proportion) + 'px auto';
            // + Math.round(this.matrixHeight / this.proportion) + 'px';
        } else {
            this.lastMatrixFrameNr = Math.floor((this.video.duration - 8) / 10);
            this.lastMatrixLine = Math.ceil((this.lastMatrixFrameNr - (this.lastMatrixNr * 36)) / 6) + 1;
            this.matrixHeight = Math.round(this.frameHeight * this.lastMatrixLine);
            this.frame.nativeElement.style['background-size'] = Math.round(this.matrixWidth / this.proportion) + 'px auto';
            // + Math.round(this.matrixHeight / this.proportion) + 'px';
        }

        let curFrameNr: number = Math.floor(this.time / 10) - Math.floor(36 * curMatrixNr);

        if (curFrameNr < 0) {
            curFrameNr = 0;
        }
        if (curFrameNr > this.lastMatrixFrameNr) {
            curFrameNr = this.lastMatrixFrameNr;
        }

        // calculate current line and columne number in the matrix and get current frame / preview image position
        const curLineNr: number = Math.floor(curFrameNr / 6);
        const curColNr: number = Math.floor(curFrameNr - (curLineNr * 6));
        const cssParams: string = '-' + (curColNr * this.frameWidth) + 'px -' + (curLineNr * this.frameHeight) + 'px';
        // console.log('curFramePos', curFramePos);

        this.frame.nativeElement.style['background-image'] = 'url(' + this.matrix + '.jpg/full/full/0/default.jpg)';


        this.frame.nativeElement.style['background-position'] = cssParams;

    }

    openVideo() {
        this.open.emit({ video: this.video.id, time: Math.round(this.time) });
    }


}
