import { TestBed } from '@angular/core/testing';

import { MovingImagePreviewService } from './moving-image-preview.service';

describe('MovingImagePreviewService', () => {
  let service: MovingImagePreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovingImagePreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
