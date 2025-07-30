import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ApiKeySettings } from '../../model/settings.model';

@Injectable({ providedIn: 'root' })
export class ApiKeyService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080';

  getApiKeySettings(userId: number): Observable<ApiKeySettings> {
    return this.http.get<ApiKeySettings>(`${this.baseUrl}/api/users/${userId}`);
  }

  saveApiKey(userId: number, data: ApiKeySettings): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/add-apikey/${userId}`, data);
  }
}
