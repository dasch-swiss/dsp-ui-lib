import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
    let pipe: TruncatePipe;
    let snippet: string;

    beforeEach(() => {
        pipe = new TruncatePipe();
        snippet = 'The quick brown fox jumps over the lazy dog.';
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should truncate after 15 characters', () => {
        const truncatedSnippet = pipe.transform(snippet, 15);
        expect(truncatedSnippet).toEqual('The quick brown...');
    });

    it('should truncate after 19 characters and add an exclamation mark at the end', () => {
        const truncatedSnippet = pipe.transform(snippet, 19, '!');
        expect(truncatedSnippet).toEqual('The quick brown fox!');
    });

    it('should truncate after 20 characters by default', () => {
        const truncatedSnippet = pipe.transform(snippet);
        expect(truncatedSnippet).toEqual('The quick brown fox ...');
    });
});
