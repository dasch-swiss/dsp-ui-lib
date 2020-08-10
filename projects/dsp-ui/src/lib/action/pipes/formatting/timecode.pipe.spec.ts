import { TimecodePipe } from './timecode.pipe';

describe('TimecodePipe', () => {
  it('create an instance', () => {
    const pipe = new TimecodePipe();
    expect(pipe).toBeTruthy();
  });
});
