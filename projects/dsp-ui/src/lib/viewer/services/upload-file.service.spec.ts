import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { UploadFileService } from './upload-file.service';

describe('UploadFileService', () => {
  let service: UploadFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule]
    });
    service = TestBed.inject(UploadFileService);
  });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
});
