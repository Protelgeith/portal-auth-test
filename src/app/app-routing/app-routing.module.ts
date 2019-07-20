import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from '../app.component';
import { PreregistroComponent } from '../preregistro/preregistro.component';
import { RegistroComponent } from '../registro/registro.component';
import { HomeComponent } from '../home/home.component';
import { SolicitudesComponent } from '../solicitudes/solicitudes.component';
import { SolicitudComponent } from '../solicitud/solicitud.component';
import { RolesComponent } from '../roles/roles.component';
import { AddAvisoComponent } from '../add-aviso/add-aviso.component';
import { AuthGuard } from '../auth/auth-guard.service';
import { RoleGuard } from '../auth/role-guard.service';
import { ConfiguracionComponent } from '../configuracion/configuracion.component';

const appRoutes: Routes = [
	{ path: 'preregistro', component: PreregistroComponent, canActivate: [AuthGuard] },
	{ path: 'registro/:id/:status', component: RegistroComponent, canActivate: [AuthGuard] }, //Comprador y admin
	{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'solicitud', component: SolicitudComponent, canActivate: [AuthGuard] },
	{ path: 'solicitudes', component: SolicitudesComponent, canActivate: [RoleGuard] }, //Comprador y admin
	{ path: 'roles', component: RolesComponent, canActivate: [RoleGuard] }, //Admin
	{ path: 'add-aviso', component: AddAvisoComponent, canActivate: [RoleGuard] }, //Admin
	{ path: 'configuracion', component: ConfiguracionComponent, canActivate: [RoleGuard] }, //Admin
	{ path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
	{ path: '**', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] }
];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
