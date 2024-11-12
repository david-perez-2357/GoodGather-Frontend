import { Routes } from '@angular/router';
import {PageNotFoundComponent} from '../page/page-not-found/page-not-found.component';
import {ViewAllEventsComponent} from '../page/view-all-events/view-all-events.component';


export const routes: Routes = [
  {'path': 'page-index', 'component': ViewAllEventsComponent},
  {'path': '**', 'component': PageNotFoundComponent},
];
