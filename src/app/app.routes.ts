import { Routes } from '@angular/router';
import { AuthComponent } from '../auth/auth.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ElectionsComponent } from '../elections/elections.component';
import { VoteComponent } from '../vote/vote.component';
import { ResultsComponent } from '../results/results.component';
import { UploadComponent } from '../upload/upload.component';
import { AccountComponent } from '../account/account.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    declarations: [],
    imports: [BrowserModule, HttpClientModule, AuthComponent, DashboardComponent, ElectionsComponent, VoteComponent, ResultsComponent, AccountComponent],
    providers: [],
    bootstrap: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule{}

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
    },
    {
        path: 'upload',
        component: UploadComponent
    }
    
];


