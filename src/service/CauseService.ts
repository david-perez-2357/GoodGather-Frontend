import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Cause from '../interface/Cause';

@Injectable({providedIn: 'root'})
export class CauseService {
  constructor(private http: HttpClient) {
  }

  getCause(id: number): Observable<Cause> {
    return this.http.get<Cause>(`/api/cause/${id}`, { withCredentials: true });
  }

  getAllCauses(): Observable<Cause[]> {
    return this.http.get<Cause[]>('/api/cause', { withCredentials: true });
  }

  getCauseFunds(id: number): Observable<number> {
    return this.http.get<number>(`/api/cause/${id}/funds`, { withCredentials: true });
  }

  getCausesInUsersRange(userId: number): Observable<Cause[]> {
    return this.http.get<Cause[]>(`/api/cause/user/${userId}`, { withCredentials: true });
  }

  createCause(cause: Cause): Observable<Cause> {
    return this.http.post<Cause>('/api/cause', cause, { withCredentials: true });
  }
}
