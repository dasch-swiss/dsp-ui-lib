import { FormattedBooleanPipe } from './formatted-boolean.pipe';

describe('FormattedBooleanPipe', () => {
  it('create an instance', () => {
    const pipe = new FormattedBooleanPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return a string of false', () => {
    const pipe = new FormattedBooleanPipe();
    const myBoolean: boolean = false;

    const convertedBoolean = pipe.transform(myBoolean);

    expect(convertedBoolean).toEqual('false');
});
});
