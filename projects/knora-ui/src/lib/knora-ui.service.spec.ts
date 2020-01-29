import { TestBed } from '@angular/core/testing';

import { KnoraUiService } from './knora-ui.service';

describe('KnoraUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KnoraUiService = TestBed.get(KnoraUiService);
    expect(service).toBeTruthy();
  });
});
