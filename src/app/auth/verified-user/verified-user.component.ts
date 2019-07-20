import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

declare var swal: any;
@Component({
  selector: 'app-verified-user',
  templateUrl: './verified-user.component.html',
  styleUrls: ['./verified-user.component.scss']
})
export class VerifiedUserComponent implements OnInit {


  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    let id = this.route.params['_value'].id
    this.authService.authUser(id).subscribe((res) => {

      swal({
        title: 'Usuario autorizado',
        html: 'En breve seras redireccionado al login.',
        timer: 3000,
        type: 'success',
        onOpen: () => {
          swal.showLoading()
        },
        onClose: () => {
          this.router.navigate(['../auth/login'])
        }
      }).then((result) => {

      }).catch((err) => {

      })
    })

  }

}
