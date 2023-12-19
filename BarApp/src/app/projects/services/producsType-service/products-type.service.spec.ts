import { TestBed } from '@angular/core/testing';

import { ProductsTypeService } from './products-type.service';

describe('ProductsTypeService', () => {
  let service: ProductsTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
