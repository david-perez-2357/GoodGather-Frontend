import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, tap} from 'rxjs';
import UserClient from '../interface/UserClient';
import {Router} from '@angular/router';




@Injectable({ providedIn: 'root' })

export class UserClientService {
  constructor(private http: HttpClient, private router: Router) { }
// this.http.post('/api/api/v1/auth/authenticate', {username: 'jgarcia', password: '1234'}, { withCredentials: true }).subscribe();

  createUser(user:UserClient){
    this.http.post('/api/client', user, { withCredentials: true }).subscribe();

  }


  doLogin(username:string, password:string){
    this.http.post('/api/api/v1/auth/authenticate', { username, password },
      { withCredentials: true, responseType: 'text' })
      .subscribe({
        next: (response) =>{
          console.log('Login successful:', response);
          this.router.navigate(['**']);
        },
        error: (error) =>{
          console.error('Login failed:', error);
          alert('Login failed. Please try again.');
        }
      });
  }




  doLogOut():void{
    this.http.post('/api/api/v1/auth/logout', {},
      { withCredentials: true, responseType: 'text' })
      .subscribe({
      next: (response) =>{
        this.router.navigate(['/login']);
        console.log('Logout successful', response);
      },
      error: (error) =>{
        console.error('Logout failed:', error);
        alert('logout failed. Please try again.');

      }

    });
  }

  isLoggedIn(): boolean {
    return document.cookie.includes('session_token');  // Adjust based on your cookie name
  }


}
