import { ReversePipe } from './reverse.pipe';
import { SortingService } from '../../services/sorting.service';

describe('ReversePipe', () => {

  let pipe: ReversePipe;
  const data = ['Bernouilli', 'Euler', 'Goldbach', 'Hermann'];

  beforeEach(() => {
    pipe = new ReversePipe(new SortingService());
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should slice and reverse data', () => {
    expect(pipe.transform(data)).toEqual(['Hermann', 'Goldbach', 'Euler', 'Bernouilli']);
  });
});
