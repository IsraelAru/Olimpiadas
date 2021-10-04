import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDiario } from '../diario.model';

@Component({
  selector: 'jhi-diario-detail',
  templateUrl: './diario-detail.component.html',
})
export class DiarioDetailComponent implements OnInit {
  diario: IDiario | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ diario }) => {
      this.diario = diario;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
