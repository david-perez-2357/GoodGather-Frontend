import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import UserClient from '@/interface/UserClient';
import User from '@/interface/User';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  getCurrentUserFromServer(): Observable<any> {
    return this.http.get('/api/api/v1/auth/user', { withCredentials: true });
  }

  createUser(user:UserClient):Observable<any>{
    return this.http.post('/api/api/v1/auth/register', user, { withCredentials: true });
  }

  doLogin(user:User):Observable<User> {
    return this.http.post<User>('/api/api/v1/auth/authenticate', user,
      { withCredentials: true});
  }

  doLogOut():Observable<any>{
    return this.http.post('/api/api/v1/auth/logout', {},
      { withCredentials: true, responseType: 'text' });

  }

  isUserExist(username:string):Observable<boolean>{
    const params = new HttpParams().set('username', username);
    return this.http.get<boolean>('api/api/v1/auth/ckeck-username-exists', {withCredentials: true, params: { username } });

  }

  isEmailExist(email:string):Observable<boolean>{
    const params = new HttpParams().set('username', email);
    return this.http.get<boolean>('api/api/v1/auth/ckeck-email-exists', {withCredentials: true, params: { email } });

  }

}
