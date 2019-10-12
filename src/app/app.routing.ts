import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { ForgotComponent } from './views/forgot/forgot.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    data: {
      title: 'Forgot Password Page'
    }
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'purse',
        loadChildren: () => import('./views/purse/purse.module').then(m => m.PurseModule)
      },
      {
        path: 'sellers',
        loadChildren: () => import('./views/sellers/sellers.module').then(m => m.SellersModule)
      },
      {
        path: 'account-settings',
        loadChildren: () => import('./views/account-settings/account-settings.module').then(m => m.AccountSettingsModule)
      },
      {
        path: 'faq',
        loadChildren: () => import('./views/faq/faq.module').then(m => m.FaqModule)
      },
      {
        path: 'terms-and-conditions',
        loadChildren: () => import('./views/terms-and-conditions/terms-and-conditions.module').then(m => m.TermsAndConditionsModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
