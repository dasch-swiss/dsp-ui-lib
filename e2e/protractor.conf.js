// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const tsConfig = require('../tsconfig.json'); // https://github.com/nrwl/nx/issues/263#issuecomment-485889032

// define the global window object because jsonld needs it
global['window'] = {
    addEventListener: () => {}
};
const {SpecReporter, StacktraceOption} = require('jasmine-spec-reporter');

/**
 * @type { import("protractor").Config }
 */
exports.config = {
    allScriptsTimeout: 22000,
    specs: [
        './src/**/*.e2e-spec.ts',
    ],
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ['--headless', '--no-sandbox', '--disable-gpu']
        }
    },
    directConnect: true,
    baseUrl: 'http://localhost:4200/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        print: function () {
        }
    },
    onPrepare() {
        require('ts-node').register({
            project: require('path').join(__dirname, './tsconfig.json')
        });
        require('tsconfig-paths').register({
            project: require('path').join(__dirname, './tsconfig.json'),
            baseUrl: './',
            paths: tsConfig.compilerOptions.paths
        });
        jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: StacktraceOption.RAW}}));
    }
};
