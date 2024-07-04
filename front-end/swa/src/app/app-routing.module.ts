import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './ActivateGuard/AuthGuardService';
import { MessageComponent } from './components/message/message.component';


const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },

  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuardService],
  },

  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },

  {
    path: 'message',
    component: MessageComponent,
    canActivate: [AuthGuardService],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
