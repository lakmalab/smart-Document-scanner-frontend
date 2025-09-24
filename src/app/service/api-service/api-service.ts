import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  
  getBaseUrl(): string {
    return this.baseUrl;
  }
  get<T>(
    endpoint: string,
    params?: HttpParams,
    options?: {
      headers?: HttpHeaders;
      observe?: 'body';
      responseType?: 'json';
    }
  ): Observable<T>;

  get<T>(
    endpoint: string,
    params: HttpParams | undefined,
    options: {
      headers?: HttpHeaders;
      observe?: 'body';
      responseType: 'text';
    }
  ): Observable<string>;

  get<T>(
    endpoint: string,
    params?: HttpParams,
    options: any = {}
  ): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${endpoint}`, {
      params,
      ...options,
    });
  }

  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { headers });
  }

  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, { headers });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }

  getRaw(endpoint: string, options?: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, options);
  }

  postBlob(endpoint: string, body: any = null): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, body, {
      responseType: 'blob',
    });
  }
}
