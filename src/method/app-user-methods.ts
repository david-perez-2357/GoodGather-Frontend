import AppUser from '@/interface/AppUser';
import {callAPI} from '@/method/response-mehods';
import {AuthService} from '@/service/AuthService';
import ApiResponse from '@/interface/ApiResponse';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
class AppUserMethods {
  constructor(private authService: AuthService) {
  }

  /**
   * Obtiene la información del usuario autenticado desde el servidor y la procesa mediante  'parseAppUser'
   * @return Promise<ApiRespose>
   */
  getCurrentUser(): Promise<ApiResponse> {
    return callAPI(this.authService.getCurrentUserFromServer()).then((response: ApiResponse) => {
      if (response.status === 200) {
        response.data = this.parseAppUser(response.data);
      }
      return response;
    }).catch((error: ApiResponse) => {
      return error;
    });
  }

  /**
   * Transforma los datos recibidos en un objeto de tipo `AppUser`.
   * Este método toma un objeto de datos genérico y lo mapea a la estructura definida
   * por la interfaz `AppUser`, incluyendo la generación de un avatar basado en el nombre de usuario.
   * @private
   * @param {any} data - Datos genéricos obtenidos del servidor que representan al usuario.
   * @returns {AppUser} Objeto `AppUser` con los datos mapeados.
   */
  private parseAppUser(data: any) {
    const appUser: AppUser = {
      id: data.id,
      username: data.username,
      email: data.email,
      name: data.firstname,
      surname: data.surname,
      country: data.country,
      province: data.province,
      avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${data.username}`
    };
    return appUser;
  }
}

export {AppUserMethods};
