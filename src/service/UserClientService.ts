import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import UserClient from '@/interface/UserClient';
import User from '@/interface/User';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';





@Injectable({ providedIn: 'root' })

export class UserClientService {
  constructor(private http: HttpClient, private router: Router) { }
// this.http.post('/api/api/v1/auth/authenticate', {username: 'jgarcia', password: '1234'}, { withCredentials: true }).subscribe();

  createUser(user:UserClient){
    return this.http.post('/api/api/v1/auth/register', user, { withCredentials: true });
  }


  doLogin(user:User) {
    return this.http.post<User>('/api/api/v1/auth/authenticate', user,
      { withCredentials: true});
  }




  doLogOut():Observable<any>{
    return this.http.post('/api/api/v1/auth/logout', {},
      { withCredentials: true, responseType: 'text' });

  }





  isLoggedIn(): boolean {
    return document.cookie.includes('session_token');  // Adjust based on your cookie name
  }


}

