import { AppPage } from './app.po';
import { browser, by, element, ElementArrayFinder, ElementFinder, logging, WebElement } from 'protractor';
import { HarnessLoader } from '@angular/cdk/testing';
import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';

describe('Test App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    describe('Playground Read Page', () => {

        it('should display welcome message', async () => {
            page.navigateTo('read');
            expect(page.getTitleText()).toEqual('dsp-ui-lib app is running!');
        });

    });

    describe('Playground Modify Page', () => {
        let loader: HarnessLoader;

        it('should display an integer value', async () => {
            await page.navigateTo('modify');

            const valueEleComp: WebElement = await page.getComponentBySelector('dsp-int-value');

            const intValEleField = await page.getReadValueFieldFromValueComponent(valueEleComp);
            expect(await intValEleField.getText()).toEqual('1');

        });

        fit('should edit an integer value', async () => {

            await page.navigateTo('modify');

            const valueEleComp: WebElement = await page.getComponentBySelector('dsp-int-value');

            const displayEditComp: WebElement = await page.getDisplayEditComponentFromValueComponent(valueEleComp);

            const editButton: WebElement = await page.getEditButtonFromDisplayEditComponent(displayEditComp);

            await editButton.click();

            // loader = ProtractorHarnessEnvironment.loader({queryFn: (selector: string, root: ElementFinder) => root.all(by.css(selector))});
            // loader = ProtractorHarnessEnvironment.loader({queryFn: (selector: string, root: ElementFinder) => displayEdit as unknown as ElementArrayFinder});

            /*const editButtons = await loader.getAllHarnesses(MatButtonHarness.with({selector: '.edit'}));

            await editButtons[5].click();*/

            loader = ProtractorHarnessEnvironment.loader();

            const matInput = await loader.getHarness(MatInputHarness.with({selector: '.value'}));

            await matInput.setValue('91');

            const saveButton = await page.getSaveButtonFromDisplayEditComponent(displayEditComp);

            await saveButton.click();

            const EC = browser.ExpectedConditions;

            browser.wait(EC.presenceOf(element(by.css('.rm-value'))), 2000,
                'Wait for read value to be visible.');

            const readEle = await page.getReadValueFieldFromValueComponent(valueEleComp);
            expect(await readEle.getText()).toEqual('91');

            browser.sleep(5000);

            /*const intValEle = await page.getReadValueFieldFromValueComponent(valueEleComp);

            expect(await intValEle.getText()).toEqual('3');

            browser.sleep(5000);*/

        });

    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
