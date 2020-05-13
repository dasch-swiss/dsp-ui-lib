import { StringifyStringLiteralPipe } from './stringify-string-literal.pipe';
import { StringLiteral } from '@knora/api';

describe('StringifyStringLiteralPipe', () => {

    let pipe: StringifyStringLiteralPipe;
    const sl1: StringLiteral = new StringLiteral();
    sl1.value = 'Switzerland';
    sl1.language = 'en';

    const sl2: StringLiteral = new StringLiteral();
    sl2.value = 'Schweiz';
    sl2.language = 'de';

    const sl3: StringLiteral = new StringLiteral();
    sl3.value = 'Suisse';
    sl3.language = 'fr';

    const data: StringLiteral[] = [sl1, sl2, sl3];

    beforeEach(() => {
        pipe = new StringifyStringLiteralPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return a string of all array elements with langauge', () => {
        expect(pipe.transform(data, 'all')).toEqual('Switzerland (en) / Schweiz (de) / Suisse (fr)');
    });
});
