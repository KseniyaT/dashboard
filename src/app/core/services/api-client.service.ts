import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(this.getFullUrl(url), { params, headers });
  }

  post<T, B = unknown>(
    url: string,
    body: B,
    params?: HttpParams,
    headers?: HttpHeaders,
  ): Observable<T> {
    return this.http.post<T>(this.getFullUrl(url), body, { params, headers });
  }

  put<T, B = unknown>(
    url: string,
    body: B,
    params?: HttpParams,
    headers?: HttpHeaders,
  ): Observable<T> {
    return this.http.put<T>(this.getFullUrl(url), body, { params, headers });
  }

  delete<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(this.getFullUrl(url), { params, headers });
  }

  patch<T, B = unknown>(
    url: string,
    body: B,
    params?: HttpParams,
    headers?: HttpHeaders,
  ): Observable<T> {
    return this.http.patch<T>(this.getFullUrl(url), body, { params, headers });
  }

  private getFullUrl(url: string): string {
    return url.startsWith('http') ? url : `${this.baseUrl}${url}`;
  }
}
