import { Routes } from '@angular/router';
import { AuthComponent } from '../auth/auth.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CandidatesComponent } from '../candidates/candidates.component';
import { VoteComponent } from '../vote/vote.component';
import { ResultsComponent } from '../results/results.component';
import { ProfileComponent } from '../profile/profile.component';

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
        path: 'candidates',
        component: CandidatesComponent
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
        path: 'profile',
        component: ProfileComponent
    }
    
];
