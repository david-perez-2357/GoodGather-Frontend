import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import Ticket from '@/interface/Ticket';
import {getCurrentUser, userIsLoggedIn} from '@/method/app-user-methods';

@Injectable({providedIn: 'root'})
export class TicketService {
  constructor(private http: HttpClient) {
  }

  getTicketsBoughtInLast24h(id: number): Observable<number> {
    return this.http.get<number>(`/api/ticket/byEvent/${id}/boughtInLast/24h`, { withCredentials: true });
  }

  getTicketsBoughtByUserAndEvent(Userid: number, eventId: number): Observable<number> {
    return this.http.get<number>(`/api/ticket/byEvent/${eventId}/byUser/${Userid}`, { withCredentials: true });
  }

  buyTicket(ticket: Ticket): Observable<void> {
    return this.http.post<void>('/api/ticket', ticket, { withCredentials: true });
  }

  getTicketsBoughtByActiveUser(): Observable<Ticket[]> {
    const activeUser = userIsLoggedIn() ? getCurrentUser() : { id: 0 };
    return this.http.get<Ticket[]>(`/api/ticket/byUser/${activeUser.id}`, { withCredentials: true });
  }
}
