import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MobileTokenSettings } from '../../model/mobile-token-settings.model';
import { ApiService } from '../api-service/api-service';

@Injectable({ providedIn: 'root' })
export class MobileTokenService {
  private api = inject(ApiService);

  getToken(userId: number): Observable<MobileTokenSettings> {
    return this.api.get<MobileTokenSettings>(`mobile/users/${userId}`);
  }

  getQRCode(userId: number): Observable<string> {
    return this.api.get<string>(`mobile/users/${userId}/qr`, undefined, {
      responseType: 'text' as 'text',
    });
  }

  refreshToken(userId: number): Observable<any> {
    return this.api.post(`mobile/users/${userId}/refresh`, null);
  }
}
