import { browser, by, element, WebElement, WebElementPromise } from 'protractor';

export class AppPage {
    navigateTo(segment: string) {
        return browser.get(browser.baseUrl + segment) as Promise<any>;
    }

    getTitleText() {
        return element(by.css('app-root span')).getText() as Promise<string>;
    }

    getComponentBySelector(selector: string): WebElement {
        return element(by.css('app-root ' + selector)).getWebElement();
    }

    getReadValueFieldFromValueComponent(valueComp: WebElement) {
        return valueComp.findElement(by.css('.rm-value'));
    }

    getDisplayEditComponentFromValueComponent(valueComp: WebElement): WebElementPromise {
        return valueComp.findElement(by.xpath('ancestor::dsp-display-edit'));
    }

    getEditButtonFromDisplayEditComponent(displayEditComp: WebElement): WebElementPromise {
        return displayEditComp.findElement(by.css('button.edit'));
    }

    getSaveButtonFromDisplayEditComponent(displayEditComp: WebElement): WebElementPromise {
        return displayEditComp.findElement(by.css('button.save'));
    }

}
