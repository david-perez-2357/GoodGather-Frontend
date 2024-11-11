import { Routes } from '@angular/router';
import {PageNotFoundComponent} from '../page/page-not-found/page-not-found.component';
import {CreateEventComponent} from '../page/create-event/create-event.component';

export const routes: Routes = [
  {'path': 'organize-event', 'component': CreateEventComponent },
  {'path': '**', 'component': PageNotFoundComponent}
];
