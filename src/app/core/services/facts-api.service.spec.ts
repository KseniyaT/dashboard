import { TestBed } from '@angular/core/testing';
import { FactsApiService } from './facts-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FACTS_URL } from '@core/constants/api.constants';
import { IFactResponse } from '../models/fact-response.interface';

describe('FactsApiService', () => {
  let service: FactsApiService;
  let httpMock: HttpTestingController;

  const mockFact: IFactResponse = {
    id: '1',
    text: 'Test fact',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FactsApiService],
    });
    service = TestBed.inject(FactsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get random fact', () => {
    service.getRandomFact().subscribe(fact => {
      expect(fact).toEqual(mockFact);
    });

    const req = httpMock.expectOne(`${FACTS_URL}/random`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFact);
  });

  it('should search facts', () => {
    const query = 'test';
    const mockFacts: IFactResponse[] = [mockFact];

    service.searchFacts(query).subscribe(facts => {
      expect(facts).toEqual(mockFacts);
    });

    const req = httpMock.expectOne(`${FACTS_URL}/search?query=${encodeURIComponent(query)}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFacts);
  });

  it('should handle error when getting random fact', () => {
    const errorMessage = 'Error fetching fact';
    service.getRandomFact().subscribe({
      error: error => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne(`${FACTS_URL}/random`);
    req.flush(errorMessage, { status: 500, statusText: errorMessage });
  });
});
