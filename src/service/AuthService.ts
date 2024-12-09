import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import UserClient from '@/interface/UserClient';
import User from '@/interface/User';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  /**
   * Obtiene la información del usuario actual desde el servidor.
   * @returns {Observable<any>} Un observable que emite los datos del usuario actual al resolver la solicitud.
   * La solicitud incluye las credenciales para mantener la sesión activa.
   */
  getCurrentUserFromServer(): Observable<any> {
    return this.http.get('/api/api/v1/auth/user', { withCredentials: true });
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param {UserClient} user - Objeto que contiene los datos del usuario a registrar.
   * @returns {Observable<any>} Un observable que emite la respuesta del servidor tras completar el registro.
   * La solicitud incluye credenciales para manejar la sesión tras el registro.
   */
  createUser(user:UserClient):Observable<any>{
    return this.http.post('/api/api/v1/auth/register', user, { withCredentials: true });
  }

  /**
   * Autentica a un usuario con las credenciales proporcionadas.
   * @param {User} user - Objeto que contiene las credenciales de inicio de sesión del usuario.
   * @returns {Observable<User>} Un observable que emite los datos del usuario autenticado si el inicio de sesión es exitoso.
   */
  doLogin(user:User):Observable<User> {
    return this.http.post<User>('/api/api/v1/auth/authenticate', user,
      { withCredentials: true});
  }

  /**
   * Cierra la sesión del usuario actual.
   * @returns {Observable<any>} Un observable que emite la respuesta del servidor tras cerrar la sesión.
   * La solicitud incluye credenciales y espera una respuesta de texto.
   */
  doLogOut():Observable<any>{
    return this.http.post('/api/api/v1/auth/logout', {},
      { withCredentials: true, responseType: 'text' });

  }

  /**
   * Verifica si un nombre de usuario ya existe en el sistema.
   * @param {string} username - Nombre de usuario a verificar.
   * @returns {Observable<boolean>} Un observable que emite `true` si el usuario existe, de lo contrario, `false`.
   */
  isUserExist(username:string):Observable<boolean>{
    const params = new HttpParams().set('username', username);
    return this.http.get<boolean>('api/api/v1/auth/ckeck-username-exists', {withCredentials: true, params: { username } });

  }

  /**
   * Verifica si un correo electrónico ya está registrado en el sistema.
   * @param {string} email - Correo electrónico a verificar.
   * @returns {Observable<boolean>} Un observable que emite `true` si el correo existe, de lo contrario, `false`.
   */
  isEmailExist(email:string):Observable<boolean>{
    const params = new HttpParams().set('username', email);
    return this.http.get<boolean>('api/api/v1/auth/ckeck-email-exists', {withCredentials: true, params: { email } });

  }

}
