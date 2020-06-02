import { AppPage } from './app.po';
import { browser, by, logging } from 'protractor';

describe('workspace-project App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display welcome message', async () => {
        page.navigateTo('modify');
        expect(page.getTitleText()).toEqual('dsp-ui-lib app is running!');
    });

    it('should display an integer value', async () => {
        page.navigateTo('modify');
        const ele = await page.getComponentBySelector('dsp-int-value').getWebElement();

        const intValEle = await ele.findElement(by.css('.rm-value'));
        expect(await intValEle.getText()).toEqual('1');

    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
