import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
    let pipe: TruncatePipe;

    beforeEach(() => {
        pipe = new TruncatePipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should truncate after 15 characters', () => {
        expect(pipe.transform('The quick brown fox jumps over the lazy dog.', ['15'])).toEqual('The quick brown...');
    });

    it('should truncate after 19 characters and add an exclamation mark at the end', () => {
        expect(pipe.transform('The quick brown fox jumps over the lazy dog.', ['19', '!'])).toEqual('The quick brown fox!');
    });
});
