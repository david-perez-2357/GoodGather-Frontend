import {Component, Inject, OnInit} from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem, MessageService} from 'primeng/api';
import {ChipsModule} from 'primeng/chips';
import {AvatarModule} from 'primeng/avatar';
import {AppService} from '@/service/AppService';
import {ToastModule} from 'primeng/toast';
import ApiResponse from '@/interface/ApiResponse';
import {callAPI} from '@/method/response-mehods';
import {Router} from '@angular/router';
import {UserClientService} from '@/service/UserClientService';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenuModule} from 'primeng/menu';
import {PasswordModule} from 'primeng/password';
import AppUser from '@/interface/AppUser';
import {NgIf} from '@angular/common';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    ChipsModule,
    AvatarModule,
    ToastModule,
    SplitButtonModule,
    MenuModule,
    PasswordModule,
    NgIf,
  ],
  providers:[MessageService],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent implements OnInit {
  constructor(private appService: AppService, private messageService: MessageService, private router: Router, private userClientService: UserClientService){
  }
/*Objeto que representa al usuario autenticado*/
  activeUser: AppUser = {} as AppUser

  /*Opciones de navegación principales*/
  items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: ['/']
    },
    {
      label: 'Organizar un evento',
      icon: 'pi pi-calendar-plus',
      routerLink: ['/organize-event']
    },


  ];

  /*Opciones del menú del perfil, actualizadas dinámicamente según el estado del usuario.*/
  perfil: MenuItem[] = [
    {
      label: 'Login',
      icon: 'pi pi-sign-in',
      command: () => {
        this.router.navigate(['/login']);
      }
    }

  ]


  /**
   * Realiza la solicitud para cerrar sesión. Si tiene éxito, recarga la página.
   */
  onLogout() {
    callAPI(this.userClientService.doLogOut())
      .then((response: ApiResponse) => {
        if (response.status === 200 || 201) {
          window.location.reload();
        }
      })
      .catch((error: any) => {
        console.error('Logout failed:', error);
        this.messageService.add(error.toastMessage);
      });
  }

  /**
   * Actualiza las opciones del menú de perfil según si el usuario está autenticado.
   */
  updateMenu(): void{
    if (this.activeUser.id){
      this.perfil = [
        {
          label:'Ver perfil',
          icon:'pi pi-user',
          command: () => {
            this.router.navigate(['/profile']);
          }
        },
        {
          label: 'Cerrar sesión',
          icon: 'pi pi-sign-out',
          command: () => this.onLogout()
        },

      ];
    } else {
      this.perfil = [
        {
          label: 'Iniciar sesión',
          icon: 'pi pi-sign-in',
          command: () => {
            this.router.navigate(['/login']);
          }
        },
        {
          label: 'Registrarse',
          icon: 'pi pi-user-plus',
          command: () => {
            this.router.navigate(['/register']);
          }
        },
      ];

    }
  }

  /**
   * Suscribe el componente a los cambios del usuario activo y actualiza el menú.
   */
  ngOnInit() {
    this.appService.appUser$.subscribe(user => {
      this.activeUser = user;
      this.updateMenu();
    });

      this.updateMenu();
  }
}
