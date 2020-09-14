import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
// import { SelectOntologyHarness } from '../../projects/dsp-ui/src/lib/search/advanced-search/select-ontology/select-ontology.harness'; // TODO: import from lib path
import { SelectOntologyHarness } from '@dasch-swiss/dsp-ui';
import { MatInputHarness } from '@angular/material/input/testing';
import { browser, by, element, logging, WebElement } from 'protractor';
import { AppPage } from './app.po';

describe('Test App', () => {
    let page: AppPage;
    const timeout = 6000;

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

        it('should display an integer value', async () => {
            await page.navigateTo('modify');

            const valueEleComp: WebElement = await page.getComponentBySelector('dsp-int-value', timeout);

            const intValEleField = await page.getReadValueFieldFromValueComponent(valueEleComp);
            expect(await intValEleField.getText()).toEqual('1');

        });

        it('should edit an integer value', async () => {

            await page.navigateTo('modify');

            let valueEleComp: WebElement = await page.getComponentBySelector('dsp-int-value', timeout);

            const displayEditComp: WebElement = await page.getDisplayEditComponentFromValueComponent(valueEleComp);

            await browser.actions().mouseMove(element(by.cssContainingText('.value-component', /^1$/))).perform();

            expect(element(by.css('.action-bubble')).isDisplayed()).toBeTruthy();

            const editButton: WebElement = await page.getEditButtonFromDisplayEditComponent(displayEditComp);

            await editButton.click();

            const loader = ProtractorHarnessEnvironment.loader();

            const matInput = await loader.getHarness(MatInputHarness.with({selector: '.value'}));

            await matInput.setValue('3');

            const saveButton = await page.getSaveButtonFromDisplayEditComponent(displayEditComp);

            await saveButton.click();

            const EC = browser.ExpectedConditions;

            await browser.wait(EC.presenceOf(element(by.css('.rm-value'))), timeout,
                'Wait for read value to be visible.');

            // a new element is created in the DOM when we update a value
            // therefore we need to get a reference to the element again, otherwise it will be stale
            valueEleComp = await page.getComponentBySelector('dsp-int-value', timeout);

            const readEle = await page.getReadValueFieldFromValueComponent(valueEleComp);
            expect(await readEle.getText()).toEqual('3');

        });

    });

    describe('Playground Advanced Search Page', () => {

        it('should select an ontology and a resource class', async () => {
            await page.navigateTo('advanced-search');

            const EC = browser.ExpectedConditions;

            const loader = ProtractorHarnessEnvironment.loader();

            const submitButton = await page.getAdvancedSearchSubmitButton(loader);

            expect(await submitButton.isDisabled()).toBe(true);

            const selectOntoHarness: SelectOntologyHarness = await loader.getHarness(SelectOntologyHarness);

            const ontoOptions = await selectOntoHarness.getOntologyOptions();

            expect(ontoOptions.length).toEqual(11);

            expect(ontoOptions[0]).toEqual('The anything ontology');

            // anything onto
            await selectOntoHarness.chooseOntology('The anything ontology');

            // check for the async response from Knora: anything and knora-api ontology
            await browser.wait(EC.presenceOf(element(by.css('.select-resource-class'))), timeout,
                'Wait for resource class options to be visible.');

            const resClasses = await page.getAdvancedSearchResourceClassSelection(loader);

            await resClasses.open();

            const resClassOptions = await resClasses.getOptions();

            expect(resClassOptions.length).toEqual(9);

            expect(await resClassOptions[2].getText()).toEqual('Thing');

            await resClasses.clickOptions({ text: 'Thing'});

            expect(await submitButton.isDisabled()).toBe(false);

            // browser.sleep(200000);

        });

        it('should select an integer property', async () => {
            await page.navigateTo('advanced-search');

            const EC = browser.ExpectedConditions;

            const loader = ProtractorHarnessEnvironment.loader();

            const submitButton = await page.getAdvancedSearchSubmitButton(loader);

            expect(await submitButton.isDisabled()).toBe(true);

            const selectOntos = await page.getAdvancedSearchOntologySelection(loader, timeout);

            await selectOntos.clickOptions({ text: 'The anything ontology'});

            // check for the async response from Knora: anything and knora-api ontology
            await browser.wait(EC.presenceOf(element(by.css('.select-resource-class'))), timeout,
                'Wait for resource class options to be visible.');

            expect(await submitButton.isDisabled()).toBe(true);

            const addPropButton = await page.getAdvancedSearchPropertyAddButton(loader);

            await addPropButton.click();

            expect(await submitButton.isDisabled()).toBe(true);

            const selectProps = await page.getAdvancedSearchPropertySelection(loader);

            await selectProps.open();

            await selectProps.clickOptions({text: 'Integer'});

            expect(await submitButton.isDisabled()).toBe(true);

            const selectCompOps = await page.getAdvancedSearchComparisonOperatorSelection(loader);

            await selectCompOps.clickOptions({ text: 'is equal to'});

            expect(await submitButton.isDisabled()).toBe(true);

            const input = await loader.getHarness(MatInputHarness);

            await input.setValue('1');

            expect(await submitButton.isDisabled()).toBe(false);

            // browser.sleep(200000);
        });

        it('should select a link property', async () => {
            await page.navigateTo('advanced-search');

            const EC = browser.ExpectedConditions;

            const loader = ProtractorHarnessEnvironment.loader();

            const submitButton = await page.getAdvancedSearchSubmitButton(loader);

            expect(await submitButton.isDisabled()).toBe(true);

            const selectOntos = await page.getAdvancedSearchOntologySelection(loader, timeout);

            await selectOntos.clickOptions({ text: 'The anything ontology'});

            // check for the async response from Knora: anything and knora-api ontology
            await browser.wait(EC.presenceOf(element(by.css('.select-resource-class'))), timeout,
                'Wait for resource class options to be visible.');

            expect(await submitButton.isDisabled()).toBe(true);

            const addPropButton = await page.getAdvancedSearchPropertyAddButton(loader);

            await addPropButton.click();

            expect(await submitButton.isDisabled()).toBe(true);

            const selectProps = await page.getAdvancedSearchPropertySelection(loader);

            await selectProps.open();

            await selectProps.clickOptions({text: 'Another thing'});

            expect(await submitButton.isDisabled()).toBe(true);

            const selectCompOps = await page.getAdvancedSearchComparisonOperatorSelection(loader);

            await selectCompOps.clickOptions({ text: 'is equal to'});

            expect(await submitButton.isDisabled()).toBe(true);

            const input = await loader.getHarness(MatInputHarness);

            await input.setValue('test');

            // check for the async response from Knora: search by label
            await browser.wait(EC.presenceOf(element(by.css('.resource'))), timeout,
                'Wait for resource options to be visible.');

            // check the options
            const autocomplete = await loader.getHarness(MatAutocompleteHarness);
            const options = await autocomplete.getOptions();

            expect(options.length).toEqual(3);

            expect(await options[0].getText()).toEqual('testding');

            await options[0].click();

            expect(await submitButton.isDisabled()).toBe(false);

            // browser.sleep(200000);
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
