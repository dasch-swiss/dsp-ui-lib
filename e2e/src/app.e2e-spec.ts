import { AppPage } from './app.po';
import { browser, by, logging, WebElement } from 'protractor';

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
            page.navigateTo('modify');
            const valueEle: WebElement = await page.getComponentBySelector('dsp-int-value').getWebElement();

            const intValEle = await valueEle.findElement(by.css('.rm-value'));
            expect(await intValEle.getText()).toEqual('1');

        });

        it('should edit an integer value', async () => {
            page.navigateTo('modify');
            const valueEle: WebElement = await page.getComponentBySelector('dsp-int-value').getWebElement();

            const displayEdit = await valueEle.findElement(by.xpath('ancestor::dsp-display-edit'));

            const editButton: WebElement = await displayEdit.findElement(by.css('button.edit'));

            await editButton.click();

            // browser.sleep(100000);
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
