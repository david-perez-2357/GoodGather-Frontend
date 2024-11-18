import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Event from '../interface/Event';

@Injectable({providedIn: 'root'})
export class EventService {
  constructor(private http: HttpClient) {
  }

  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`/api/event/${id}`, { withCredentials: true });
  }

  getTicketsBoughtInLast24h(id: number): Observable<number> {
    return this.http.get<number>(`/api/ticket/byEvent/${id}/boughtInLast/24h`, { withCredentials: true });
  }
}
