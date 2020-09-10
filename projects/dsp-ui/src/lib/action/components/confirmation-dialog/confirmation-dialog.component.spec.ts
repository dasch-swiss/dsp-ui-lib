import { OverlayContainer } from '@angular/cdk/overlay';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReadIntValue } from '@dasch-swiss/dsp-js';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationMessageComponent } from './confirmation-message/confirmation-message.component';

/**
 * Test host component to simulate parent component with a confirmation dialog.
 */
@Component({
    template: `<p> {{confirmationDialogResponse}} </p>`
})
class ConfirmationDialogTestHostComponent {

    confirmationDialogResponse: string;

    testValue: ReadIntValue;

    constructor(private dialog: MatDialog) {
    }

    openDialog() {
        this.testValue = new ReadIntValue();
        this.testValue.strval = '1';
        this.testValue.propertyLabel = 'My label';
        this.testValue.valueCreationDate = '1993-10-10T19:11:00.00Z';
        this.testValue.valueHasComment = 'My comment';

        this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Title',
                value: this.testValue,
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
                ConfirmationDialogTestHostComponent,
                ConfirmationMessageComponent
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
            expect(dialogTitle.innerHTML.trim()).toEqual('Are you sure you want to delete this value from My label?');

            const dialogMessageLabel = dialogDiv.querySelector('.message .val-label');
            expect(dialogMessageLabel.innerHTML.trim()).toEqual('Confirming this action will delete the following value from My label:');

            const dialogMessageValue = dialogDiv.querySelector('.message .val-value');
            expect(dialogMessageValue.innerHTML.trim()).toEqual('Value: 1');

            const dialogMessageComment = dialogDiv.querySelector('.message .val-comment');
            expect(dialogMessageComment.innerHTML.trim()).toEqual('Value Comment: My comment');

            const dialogMessageCreationDate = dialogDiv.querySelector('.message .val-creation-date');
            expect(dialogMessageCreationDate.innerHTML.trim()).toEqual('Value Creation Date: 1993-10-10T19:11:00.00Z');
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
