import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../shared/loader.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingRoutingModule, FormsModule, ReactiveFormsModule, LoaderModule],
  exports: [LoginComponent],
})
export class LoginModule {}
