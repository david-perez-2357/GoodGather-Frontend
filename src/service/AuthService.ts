import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  getCurrentUserFromServer(): Observable<any> {
    this.http.post('/api/api/v1/auth/logout', {}, { withCredentials: true }).subscribe();
    return this.http.get('/api/api/v1/auth/user', { withCredentials: true });
  }
}
