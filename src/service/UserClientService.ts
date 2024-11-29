import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, tap} from 'rxjs';
import UserClient from '@/interface/UserClient';
import User from '@/interface/User';
import {Router} from '@angular/router';
import ApiResponse from '@/interface/ApiResponse';




@Injectable({ providedIn: 'root' })

export class UserClientService {
  constructor(private http: HttpClient, private router: Router) { }
// this.http.post('/api/api/v1/auth/authenticate', {username: 'jgarcia', password: '1234'}, { withCredentials: true }).subscribe();

  createUser(user:UserClient){
    this.http.post('/api/client', user, { withCredentials: true }).subscribe();
  }


  doLogin(user:User) {
    return this.http.post<User>('/api/api/v1/auth/authenticate', user,
      { withCredentials: true});
  }

  //
  // doLogOut():void{
  //   this.http.post('/api/api/v1/auth/logout',
  //     { withCredentials: true}).subscribe();
  //
  // }

  doLogOut():Observable<void>{
   return this.http.post<void>('/api/api/v1/auth/logout', {},
      { withCredentials: true});

  }



  isLoggedIn(): boolean {
    return document.cookie.includes('session_token');  // Adjust based on your cookie name
  }


}

