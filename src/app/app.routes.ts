import { Routes } from '@angular/router';


import { HomeComponent } from './pages/home/home';
import { Settings } from './pages/settings/settings';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { EditProfileComponent } from './pages/settings/edit-profile/edit-profile';
import { MobileTokenComponent } from './pages/settings/mobile-token/mobile-token';
import { ApiSettingsComponent } from './pages/settings/api-settings/api-settings';
import { DocumentComponent } from './pages/document/document';
import { TemplateBuilder } from './pages/template-builder/template-builder';

export const routes: Routes = [
    {
        path: '',          
        component: HomeComponent,  
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
        component: SignupComponent 
    },
    { 
        path: 'document/:templateId',
        component: DocumentComponent
    },
    { 
        path: 'templatebuilder/:id',
        component: TemplateBuilder
    },
    {
      path: 'settings',
      component: Settings,
        children: [
          { path: '', redirectTo: 'edit-profile', pathMatch: 'full' },
          { path: 'edit-profile', component: EditProfileComponent },
          { path: 'mobile', component: MobileTokenComponent },
          { path: 'api', component: ApiSettingsComponent }// <-- make sure HelpComponent is imported
        ]
    }

    
];
