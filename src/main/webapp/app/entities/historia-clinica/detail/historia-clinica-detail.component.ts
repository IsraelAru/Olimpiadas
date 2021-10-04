import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHistoriaClinica } from '../historia-clinica.model';

@Component({
  selector: 'jhi-historia-clinica-detail',
  templateUrl: './historia-clinica-detail.component.html',
})
export class HistoriaClinicaDetailComponent implements OnInit {
  historiaClinica: IHistoriaClinica | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historiaClinica }) => {
      this.historiaClinica = historiaClinica;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
