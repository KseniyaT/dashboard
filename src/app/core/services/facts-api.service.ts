import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFactResponse } from '../models/fact-response.interface';
import { FACTS_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class FactsApiService {
  constructor(private http: HttpClient) {}

  getRandomFact(): Observable<IFactResponse> {
    return this.http.get<IFactResponse>(`${FACTS_URL}/random`);
  }

  searchFacts(query: string): Observable<IFactResponse[]> {
    return this.http.get<IFactResponse[]>(`${FACTS_URL}/search?query=${encodeURIComponent(query)}`);
  }
}
