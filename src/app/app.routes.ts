import { Routes } from '@angular/router';
import {PageNotFoundComponent} from '../page/page-not-found/page-not-found.component';
import {RegisterAndLoginComponent} from '../page/register-and-login/register-and-login.component';
import {PruebaComponent} from './prueba/prueba.component';



export const routes: Routes = [
  {'path': 'login', component: RegisterAndLoginComponent},
  {'path': 'probate', component: PruebaComponent},
  {'path': '**', component: PageNotFoundComponent},

];
