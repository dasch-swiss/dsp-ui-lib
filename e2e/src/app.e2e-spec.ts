import { AppPage } from './app.po';
import { browser, by, element, logging, WebElement } from 'protractor';
import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';

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

        it('should display an integer value', async () => {
            await page.navigateTo('modify');

            const valueEleComp: WebElement = await page.getComponentBySelector('dsp-int-value');

            const intValEleField = await page.getReadValueFieldFromValueComponent(valueEleComp);
            expect(await intValEleField.getText()).toEqual('1');

        });

        it('should edit an integer value', async () => {

            await page.navigateTo('modify');

            const valueEleComp: WebElement = await page.getComponentBySelector('dsp-int-value');

            const displayEditComp: WebElement = await page.getDisplayEditComponentFromValueComponent(valueEleComp);

            const editButton: WebElement = await page.getEditButtonFromDisplayEditComponent(displayEditComp);

            await editButton.click();

            const loader = ProtractorHarnessEnvironment.loader();

            const matInput = await loader.getHarness(MatInputHarness.with({selector: '.value'}));

            await matInput.setValue('3');

            const saveButton = await page.getSaveButtonFromDisplayEditComponent(displayEditComp);

            await saveButton.click();

            const EC = browser.ExpectedConditions;

            await browser.wait(EC.presenceOf(element(by.css('.rm-value'))), 3000,
                'Wait for read value to be visible.');

            const readEle = await page.getReadValueFieldFromValueComponent(valueEleComp);
            expect(await readEle.getText()).toEqual('3');

        });

    });

    describe('Playground Advanced Search Page', () => {

        it('should select an ontology and a resource class', async () => {
            await page.navigateTo('advanced-search');

            const loader = ProtractorHarnessEnvironment.loader();

            const submitButton = await page.getAdvancedSearchSubmitButton(loader);

            expect(await submitButton.isDisabled()).toBe(true);

            const selectOntos = await page.getAdvancedSearchOntologySelection(loader);

            await selectOntos.open();

            const ontoOptions = await selectOntos.getOptions();

            expect(ontoOptions.length).toEqual(15);

            expect(await ontoOptions[0].getText()).toEqual('The anything ontology');

            // anything onto
            await ontoOptions[0].click();

            const resClasses = await page.getAdvancedSearchResourceClassSelection(loader);

            await resClasses.open();

            const resClassOptions = await resClasses.getOptions();

            expect(resClassOptions.length).toEqual(9);

            expect(await resClassOptions[2].getText()).toEqual('Thing');

            await resClassOptions[2].click();

            expect(await submitButton.isDisabled()).toBe(false);

        });

        it('should select an integer property', async () => {
            await page.navigateTo('advanced-search');

            const loader = ProtractorHarnessEnvironment.loader();

            const submitButton = await page.getAdvancedSearchSubmitButton(loader);

            expect(await submitButton.isDisabled()).toBe(true);

            const selectOntos = await page.getAdvancedSearchOntologySelection(loader);

            await selectOntos.clickOptions({ text: 'The anything ontology'});

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

            const loader = ProtractorHarnessEnvironment.loader();

            const submitButton = await page.getAdvancedSearchSubmitButton(loader);

            expect(await submitButton.isDisabled()).toBe(true);

            const selectOntos = await page.getAdvancedSearchOntologySelection(loader);

            await selectOntos.clickOptions({ text: 'The anything ontology'});

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

            await input.setValue('testthing');

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
