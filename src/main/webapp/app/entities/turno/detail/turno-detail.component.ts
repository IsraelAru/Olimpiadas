import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITurno } from '../turno.model';

@Component({
  selector: 'jhi-turno-detail',
  templateUrl: './turno-detail.component.html',
})
export class TurnoDetailComponent implements OnInit {
  turno: ITurno | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ turno }) => {
      this.turno = turno;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
