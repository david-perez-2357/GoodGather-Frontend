import { Routes } from '@angular/router';
import {PageNotFoundComponent} from '../page/page-not-found/page-not-found.component';
import {EventDetailsComponent} from '../page/event-details/event-details.component';


export const routes: Routes = [
  {'path': 'event/:id', component: EventDetailsComponent},
  {'path': '**', 'component': PageNotFoundComponent}
];
