import { Routes } from '@angular/router';


import { SignUp } from './pages/signup/signup';
import { HomeComponent } from './pages/home/home';
import { Settings } from './pages/settings/settings';
import { EditProfile } from './pages/settings/edit-profile/edit-profile';
import { ApiSettings } from './pages/settings/api-settings/api-settings';
import { MobileToken } from './pages/settings/mobile-token/mobile-token';
import { Document } from './pages/document/document';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
     {
        path: '',          
        component: LoginComponent,  
     },
    {
        path:'login',
        component: LoginComponent
    },
    
    {
        path:'home',
        component: HomeComponent
    },
    { 
        path: 'signup',
        component: SignUp 
    },
    { 
        path: 'document',
        component: Document
    },
   {
  path: 'settings',
  component: Settings,
    children: [
      { path: '', redirectTo: 'edit-profile', pathMatch: 'full' },
      { path: 'edit-profile', component: EditProfile },
      { path: 'mobile', component: MobileToken },
      { path: 'api', component: ApiSettings }// <-- make sure HelpComponent is imported
    ]
  }

    
];
