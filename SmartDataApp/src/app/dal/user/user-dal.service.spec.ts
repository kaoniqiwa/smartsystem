import { TestBed, inject } from '@angular/core/testing';

import { UserDalService } from './user-dal.service';

describe('UserDalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserDalService]
    });
  });

  it('should be created', inject([UserDalService], (service: UserDalService) => {
    expect(service).toBeTruthy();
  }));
});
