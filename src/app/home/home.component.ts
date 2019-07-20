import { Component, OnInit } from '@angular/core';

import { DataService } from '../services/data.service';
import { Aviso } from '../shared/aviso.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  avisos: Array<Aviso>;

  constructor(private data: DataService) { }

  ngOnInit() {
    // Obtiene avisos para mostrar
    this.data.getAvisos()
      .subscribe(avisos => this.avisos = avisos);
  }

}
