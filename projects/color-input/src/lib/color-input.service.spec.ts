import { TestBed } from '@angular/core/testing';

import { ColorInputService } from './color-input.service';

describe('ColorInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorInputService = TestBed.get(ColorInputService);
    expect(service).toBeTruthy();
  });
});
