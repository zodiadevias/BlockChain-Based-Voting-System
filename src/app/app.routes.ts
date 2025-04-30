import { Routes } from '@angular/router';
import { AuthComponent } from '../auth/auth.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ElectionsComponent } from '../elections/elections.component';
import { VoteComponent } from '../vote/vote.component';
import { ResultsComponent } from '../results/results.component';

import { AccountComponent } from '../account/account.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'elections',
        component: ElectionsComponent
    },
    {
        path: 'vote',
        component: VoteComponent
    },
    {
        path: 'results',
        component: ResultsComponent
    },
    {
        path: 'account',
        component: AccountComponent
    }
    
];
