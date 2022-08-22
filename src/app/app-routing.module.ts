import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { RegistrationComponent } from './views/registration/registration.component';
import { PasswordRecoveryComponent } from './views/password-recovery/password-recovery.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';

// guards
import { BeforeLoginGuard } from './guards/before-login.guard';
import { AfterLoginGuard } from './guards/after-login.guard';
import { VerifyTokenGuard } from './guards/verify-token.guard';
import { UserHasSomeAdminRoleGuard } from './guards/user-has-some-admin-role.guard';

// resolvers
import { DetailsResolverService as ProjectDetailsResolverService } from '@services/solvers/administration/project/details-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [BeforeLoginGuard]
  },
  {
    path: 'registro',
    component: RegistrationComponent,
    canActivate: [BeforeLoginGuard]
  },
  {
    path: 'recuperar-contraseña',
    component: PasswordRecoveryComponent,
    canActivate: [BeforeLoginGuard]
  },
  {
    path: 'cambiar-contraseña',
    component: ChangePasswordComponent,
   // canActivate: [BeforeLoginGuard,VerifyTokenGuard]

  },
  {
    path: 'home',
    loadChildren: () => import('../app/views/home/home.module').then(m => m.HomeModule),
    canActivate: [AfterLoginGuard]
  },
  {
    path: 'gis',
    canActivate: [AfterLoginGuard],
    canActivateChild: [AfterLoginGuard],
    children: [
      {
        path: 'proyectos/:id',
        resolve: {
          project: ProjectDetailsResolverService
        },
        children: [
            {
              path: '',
              redirectTo: 'configurar-capas',
              pathMatch: 'full'
            },
            {
              path: 'configurar-capas',
              canActivate: [UserHasSomeAdminRoleGuard],
              canLoad: [UserHasSomeAdminRoleGuard],
              loadChildren: () => import('../app/views/gis/projects/layer-settings/layer-settings.module').then(m => m.LayerSettingsModule),
            },
            {
              path: 'mapa',
              loadChildren: () => import('../app/views/gis/projects/map/map.module').then(m => m.MapModule),
            },
            {
              path: '**',
              loadChildren: () => import('../app/views/gis/projects/layer-settings/layer-settings.module').then(m => m.LayerSettingsModule),
            }
        ]
      }
    ]

  },
  {
    path: '**',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    BeforeLoginGuard,
    AfterLoginGuard,
    VerifyTokenGuard
  ]
})
export class AppRoutingModule { }
