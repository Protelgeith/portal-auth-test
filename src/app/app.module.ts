import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatAutocompleteModule, MatCheckboxModule, MatSlideToggleModule, MatCardModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HeaderComponent } from './header/header.component';
import { PreregistroComponent } from './preregistro/preregistro.component';
import { RegistroComponent } from './registro/registro.component';
import { HomeComponent } from './home/home.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { RolesComponent } from './roles/roles.component';
import { ProfileService } from './services/profile.service';
import { DataService } from './services/data.service';
import { AdminService } from './services/admin.service';
import { EventService } from './services/event.service';
import { AuthGuard } from './auth/auth-guard.service';
import { RoleGuard } from './auth/role-guard.service'
import { FormsHelperService } from './services/forms-helper.service';
import { AddAvisoComponent } from './add-aviso/add-aviso.component';
import { AvisosComponent } from './avisos/avisos.component';
import { AuthModule } from './auth/auth.module';
import { RequestInterceptor } from './interceptors/http-error.interceptor';
import { ErrorHandler } from './interceptors/error_handler';
import { AuthHeaderInterceptor } from './interceptors/header.interceptor';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { RemovedorComillasPipe } from './pipes/removedor-comillas.pipe';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { GenerateQuickProviderModalComponent } from './generate-quick-provider-modal/generate-quick-provider-modal.component';

@NgModule({
  exports: [
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatCardModule
  ],
  declarations: []
})
export class MaterialModule { }

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PreregistroComponent,
    RegistroComponent,
    HomeComponent,
    SolicitudesComponent,
    SolicitudComponent,
    RolesComponent,
    AddAvisoComponent,
    AvisosComponent,
    LoadingModalComponent,
    ConfiguracionComponent,
    GenerateQuickProviderModalComponent,
    RemovedorComillasPipe
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    ModalModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    ProfileService,
    FormsHelperService,
    AdminService,
    DataService,
    EventService,
    AuthGuard,
    RoleGuard,
    ErrorHandler,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [GenerateQuickProviderModalComponent]
})
export class AppModule { }
