import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-input-test',
    templateUrl: './input-test.component.html',
    styleUrls: ['./input-test.component.scss']
})
export class InputTestComponent implements OnInit, OnChanges {

    @Input() myFirstInput = 'oho';

    @Input() mySecondInput = 'hi';

    constructor() {
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);

        console.log(this.myFirstInput, this.mySecondInput)
    }


}
