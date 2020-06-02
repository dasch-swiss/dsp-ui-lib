import { browser, by, element, ElementFinder } from 'protractor';

export class AppPage {
  navigateTo(segment: string) {
    return browser.get(browser.baseUrl + segment) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root span')).getText() as Promise<string>;
  }

  getComponentBySelector(selector: string): ElementFinder {
      return element(by.css('app-root ' + selector));
  }
}
