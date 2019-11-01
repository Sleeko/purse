import { TestBed } from '@angular/core/testing';

import { PurseService } from './purse.service';

describe('PurseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurseService = TestBed.get(PurseService);
    expect(service).toBeTruthy();
  });
});
