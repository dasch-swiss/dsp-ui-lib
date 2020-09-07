import { OverlayContainer } from '@angular/cdk/overlay';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

/**
 * Test host component to simulate parent component with a confirmation dialog.
 */
@Component({
    template: `<p> {{confirmationDialogResponse}} </p>`
})
class ConfirmationDialogTestHostComponent {

    confirmationDialogResponse: string;

    constructor(private dialog: MatDialog) {
    }

    openDialog() {
        this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Title',
                message: 'Message',
                buttonTextOk: 'OK',
                buttonTextCancel: 'Cancel'
            }
        }).afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.confirmationDialogResponse = 'Action was confirmed!';
            } else {
                this.confirmationDialogResponse = 'Action was cancelled';
            }
        });
      }
}

describe('ConfirmationDialogComponent', () => {
    let testHostComponent: ConfirmationDialogTestHostComponent;
    let testHostFixture: ComponentFixture<ConfirmationDialogTestHostComponent>;
    let rootLoader: HarnessLoader;
    let overlayContainer: OverlayContainer;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfirmationDialogComponent,
                ConfirmationDialogTestHostComponent
            ],
            imports: [
                MatDialogModule,
                BrowserAnimationsModule
            ],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {}
                },
                {
                    provide: MatDialogRef,
                    useValue: {}
                }
            ]
        })
        .compileComponents();

        overlayContainer = TestBed.inject(OverlayContainer);
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(ConfirmationDialogTestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(testHostFixture);
        testHostFixture.detectChanges();
        expect(testHostComponent).toBeTruthy();
    });

    afterEach(async () => {
        const dialogs = await rootLoader.getAllHarnesses(MatDialogHarness);
        await Promise.all(dialogs.map(async d => await d.close()));

        // Angular won't call this for us so we need to do it ourselves to avoid leaks.
        overlayContainer.ngOnDestroy();
    });

    it('should display a confirmation dialog', () => {

        testHostComponent.openDialog();

        testHostFixture.detectChanges();

        testHostFixture.whenStable().then(() => {
            const dialogDiv = document.querySelector('mat-dialog-container');
            expect(dialogDiv).toBeTruthy();

            const dialogTitle = dialogDiv.querySelector('.title');
            expect(dialogTitle.innerHTML.trim()).toEqual('Title');

            const dialogMessage = dialogDiv.querySelector('.message');
            expect(dialogMessage.innerHTML.trim()).toEqual('Message');
        });

    });

    it('should return a confirmation message when the OK button is clicked', async () => {

        testHostComponent.openDialog();

        let dialogHarnesses = await rootLoader.getAllHarnesses(MatDialogHarness);

        expect(dialogHarnesses.length).toEqual(1);

        const okButton = await rootLoader.getHarness(MatButtonHarness.with({selector: '.ok'}));

        await okButton.click();

        dialogHarnesses = await rootLoader.getAllHarnesses(MatDialogHarness);

        expect(dialogHarnesses.length).toEqual(0);

        expect(testHostComponent.confirmationDialogResponse).toEqual('Action was confirmed!');

    });

    it('should return a cancelled message when the cancel button is clicked', async () => {

        testHostComponent.openDialog();

        let dialogHarnesses = await rootLoader.getAllHarnesses(MatDialogHarness);

        expect(dialogHarnesses.length).toEqual(1);

        const cancelButton = await rootLoader.getHarness(MatButtonHarness.with({selector: '.cancel'}));

        await cancelButton.click();

        dialogHarnesses = await rootLoader.getAllHarnesses(MatDialogHarness);

        expect(dialogHarnesses.length).toEqual(0);

        expect(testHostComponent.confirmationDialogResponse).toEqual('Action was cancelled');


    });
});
