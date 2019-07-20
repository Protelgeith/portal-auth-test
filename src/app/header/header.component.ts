import { Component, OnInit, AfterContentInit, Input, HostListener } from '@angular/core';
import { EventService } from '../services/event.service';
import { Router, NavigationEnd } from '@angular/router';
import { TokenStorage } from '../auth/token.storage';
import { filter } from 'rxjs/operators';
import decode from 'jwt-decode';
import { MatDialog } from '@angular/material';
import { GenerateQuickProviderModalComponent } from '../generate-quick-provider-modal/generate-quick-provider-modal.component';
import { RolService } from '../services/rol.service';
import { Subject } from 'rxjs';
import { ProfileService } from '../services/profile.service';

declare var swal;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title = 'Pre-Registro de Proveedor';
  loginRoute = '/auth/login';
  registerRoute = '/auth/register';
  resetPasswordRoute = '/auth/resetPassword';
  resetPassword = '/auth/reset-password/';
  verifiedUser = '/auth/confirm-account/';
  isLogged = true;
  hideOptionByRol = {
    solicitudes: true,
    solicitud: true,
    roles: true,
    aviso: true
  }
  user = { rfc: '', email: '' }
  generateQuickProvider = false;
  showAsModal = false;
  userActivity;
  userInactive: Subject<any> = new Subject();
  showInactivityModal: boolean = true;
  currentRol: string;

  constructor(public dialog: MatDialog, private eventService: EventService, private route: Router, private token: TokenStorage, private userRol: RolService, private profile: ProfileService) {

  }

  ngOnInit() {
    this.route.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe(event => {
      if (event.url === this.loginRoute ||
        event.url === this.registerRoute ||
        event.url === this.resetPasswordRoute ||
        event.url.includes(this.verifiedUser) ||
        event.url.includes(this.resetPassword)) {
        this.isLogged = false
        this.showOptionByRol()
      } else {
        this.isLogged = true;
        this.showOptionByRol();
        switch (this.userRol.getRolByUser()) {
          case 'admin':
            this.currentRol = 'admin';
            break;

          case 'comprador':
            this.currentRol = 'comprador';
            break;

          case 'proveedor':
            this.currentRol = 'proveedor';
            break;

          default:
            this.currentRol = 'proveedor';
            break;
        }

        if (this.userRol.getRolByUser() === 'proveedor' || this.userRol.getRolByUser() === 'comprador') {
          if (this.userRol.expTime()) {
            clearTimeout(this.userActivity);
            this.showInactivityModal = true;
            this.userInactive.subscribe(() => {
              if (this.showInactivityModal) {
                swal({
                  title: 'Usuario Inactivo',
                  text: 'Se ha agotado el tiempo de sesion por motivo de inactividad.<br>Favor de volver a iniciar sesión',
                  showConfirmButton: true,
                  confirmButtonText: 'Aceptar',
                  type: 'warning'
                }).then(() => {
                  this.logOut();
                }).catch(() => {
                  this.logOut();
                })
              }
            });
            this.setTimeout();
          }
        }
      };
    });

    this.eventService.titleChangeEvent
      .subscribe(data => this.title = data);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(GenerateQuickProviderModalComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  logOut() {
    clearTimeout(this.userActivity);
    this.showInactivityModal = false;
    this.isLogged = false
    this.token.signOut();
    this.route.navigate(['auth/login']);
  }

  showOptionByRol() {
    const token = this.token.getToken();
    if (token) {
      const tokenPayload = decode(token);
      this.user.rfc = tokenPayload.rfc;
      this.user.email = tokenPayload.email;
      if (tokenPayload.rol || tokenPayload.rol == "") {
        switch (tokenPayload.rol || tokenPayload.rol == "") {
          case 'admin':
            this.hideOptionByRol.solicitudes = false;
            this.hideOptionByRol.roles = false;
            this.hideOptionByRol.aviso = false;
            this.hideOptionByRol.solicitud = true;
            break;

          case 'comprador':
            this.hideOptionByRol.solicitudes = false;
            this.hideOptionByRol.roles = true;
            this.hideOptionByRol.aviso = true;
            this.hideOptionByRol.solicitud = true;
            this.generateQuickProvider = true;
            break;

          case 'proveedor':
            this.hideOptionByRol.solicitudes = true;
            this.hideOptionByRol.roles = true;
            this.hideOptionByRol.aviso = true;
            this.hideOptionByRol.solicitud = false;
            break;

          default:
            this.hideOptionByRol.solicitudes = true;
            this.hideOptionByRol.roles = true;
            this.hideOptionByRol.aviso = true;
            this.hideOptionByRol.solicitud = false;
            break;

        }
      } else {
        this.isLogged = false;
      }
    }
  }

  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), this.userRol.expTime());
  }

  @HostListener('window:mousemove') refreshUserState01() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  @HostListener('window:mousewheel') refreshUserState02() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  @HostListener('window:click') refreshUserState03() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  @HostListener('window:keyup') refreshUserState04() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  @HostListener('window:keydown') refreshUserState05() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
}
