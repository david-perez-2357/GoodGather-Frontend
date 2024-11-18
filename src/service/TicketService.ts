import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TicketService {
  constructor(private http: HttpClient) {
  }

  getTicketsBoughtInLast24h(id: number): Observable<number> {
    return this.http.get<number>(`/api/ticket/byEvent/${id}/boughtInLast/24h`, { withCredentials: true });
  }
}
