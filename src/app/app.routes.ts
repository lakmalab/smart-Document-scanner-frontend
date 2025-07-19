import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { SignUp } from './pages/signup/signup';
import { HomeComponent } from './pages/home/home';
import { Settings } from './pages/settings/settings';
import { EditProfile } from './pages/settings/edit-profile/edit-profile';
import { ApiSettings } from './pages/settings/api-settings/api-settings';
import { MobileToken } from './pages/settings/mobile-token/mobile-token';


export const routes: Routes = [
     {
        path: '',          
        component: Login,  
     },
    {
        path:'login',
        component: Login
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
