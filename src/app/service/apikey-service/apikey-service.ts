import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api-service/api-service';
import { Observable } from 'rxjs';
import { ApiKeySettings } from '../../model/settings.model';

@Injectable({ providedIn: 'root' })
export class ApiKeyService {
 
 private api = inject(ApiService);
  getApiKeySettings(userId: number): Observable<ApiKeySettings> {
    return this.api.get<ApiKeySettings>(`api/users/${userId}`);
  }

  saveApiKey(userId: number, data: ApiKeySettings): Observable<any> {
    return this.api.post(`auth/add-apikey/${userId}`, data);
  }
}
