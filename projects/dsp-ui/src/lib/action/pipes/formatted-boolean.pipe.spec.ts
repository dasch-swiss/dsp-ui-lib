import { FormattedBooleanPipe } from './formatted-boolean.pipe';

describe('FormattedBooleanPipe', () => {
    let pipe: FormattedBooleanPipe;

    beforeEach(() => {
        pipe = new FormattedBooleanPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return "false"', () => {
        const myBoolean = false;

        const convertedBoolean = pipe.transform(myBoolean);

        expect(convertedBoolean).toEqual('false');
    });


});
