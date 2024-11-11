import { Routes } from '@angular/router';
import {PageNotFoundComponent} from '../page/page-not-found/page-not-found.component';
import {RegisterAndLoginComponent} from '../page/register-and-login/register-and-login.component';

export const routes: Routes = [
  {'path': 'register', 'component': RegisterAndLoginComponent},
  {'path': 'login', 'component': RegisterAndLoginComponent},
  {'path': '**', 'component': PageNotFoundComponent}
];
