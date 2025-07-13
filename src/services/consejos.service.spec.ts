import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 

import { ConsejosService } from './consejos.service';

describe('ConsejosService', () => {
  let service: ConsejosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [ConsejosService]
    });
    service = TestBed.inject(ConsejosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
