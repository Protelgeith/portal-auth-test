import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Portal de Proveedores';
  loginRoute = '/auth/login';
  registerRoute = '/auth/register';
  isLogged = '110px';

  constructor(private route: Router) { }

  ngOnInit(): void {
    this.route.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe(event => {
      (event.url === this.loginRoute ||
        event.url === this.registerRoute) ? this.isLogged = '0' : this.isLogged = '110px';
    });
  }

}
