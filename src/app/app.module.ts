import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule, MatInputModule, MatProgressSpinnerModule} from '@angular/material';
import {MatCardModule, MatButtonModule, MatFormFieldModule, MatToolbarModule} from '@angular/material';
import { HeadersComponent } from './header/headers.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import {MatExpansionModule} from '@angular/material';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import {ErrorComponent} from './error/error.component';
import {ErrorInterceptor} from './error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    HeadersComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    MatIconModule,
    RouterModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
