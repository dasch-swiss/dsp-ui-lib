import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SearchParams } from '../../viewer';

@Component({
    selector: 'dsp-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent {

    /**
     * @param [projectfilter] If true it shows the selection of projects to filter by one of them
     */
    @Input() projectfilter?: boolean = false;

    /**
     * @param [filterbyproject] If your full-text search should be filtered by one project, you can define it with project
     * iri in the parameter filterbyproject.
     */
    @Input() filterbyproject?: string;

    /**
     * @param [advanced] Adds the extended / advanced search to the panel
     */
    @Input() advanced?: boolean = false;

    /**
     * @param [expert] Adds the expert search / gravsearch editor to the panel
     */
    @Input() expert?: boolean = false;

    /**
     * The data event emitter of type SearchParams
     *
     * @param  search
     */
    @Output() search = new EventEmitter<SearchParams>();

    @ViewChild('fullSearchPanel', { static: false }) searchPanel: ElementRef;

    @ViewChild('searchMenu', { static: false }) searchMenu: TemplateRef<any>;

    // overlay reference
    overlayRef: OverlayRef;

    // show advanced or expert search
    showAdvanced: boolean;

    constructor(
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    ) { }

    openPanelWithBackdrop(type: string) {

        this.showAdvanced = (type === 'advanced');

        const config = new OverlayConfig({
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            positionStrategy: this.getOverlayPosition(),
            scrollStrategy: this._overlay.scrollStrategies.block()
        });

        this.overlayRef = this._overlay.create(config);
        this.overlayRef.attach(new TemplatePortal(this.searchMenu, this._viewContainerRef));
        this.overlayRef.backdropClick().subscribe(() => {
            this.overlayRef.detach();
        });
    }

    getOverlayPosition(): PositionStrategy {
        const positions = [
            new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
            new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
        ];

        // tslint:disable-next-line: max-line-length
        const overlayPosition = this._overlay.position().flexibleConnectedTo(this.searchPanel).withPositions(positions).withLockedPosition(false);

        return overlayPosition;
    }

    /**
     * Emit the search parameters
     *
     * @param data
     */
    emitSearch(data: any) {
        this.search.emit(data);
        this.closeMenu();
    }

    /**
     * Close the search menu
     */
    closeMenu(): void {
        this.overlayRef.detach();
    }

}
