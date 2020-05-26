import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe can be used to shorten long text by a defined length.
 *
 * In markup:
 *
 * {{ str | dspTruncate:24 }}
 *
 * or
 *
 * {{ str | dspTruncate:24:'...' }}
 *
 * The first optional parameter defines the length where to truncate the string.
 * The second optional parameter defines the characters to append to the shortened string. Default is '...'.
 *
 * The advantage of this pipe over the default Angular slice pipe is the simplicity of adding
 *  additional characters at the end of the shortened string.
 * The same construct with Angular slice pipe looks as follow: `{{ (str.length>24)? (str | slice:0:24)+'...':(str) }}`.
 *
 */
@Pipe({
    name: 'dspTruncate'
})
export class TruncatePipe implements PipeTransform {

    transform(value: string, limit?: number, trail?: string): string {

        if (typeof value !== 'string' || value.length === 0) {
            return '';
        }

        // default to 20 if no character limit is provided
        if (!limit) { limit = 20; }

        // default to '...' if no trail is provided
        if (!trail) { trail = '...'; }

        return value.length > limit ? value.substring(0, limit) + trail : value;
    }

}
