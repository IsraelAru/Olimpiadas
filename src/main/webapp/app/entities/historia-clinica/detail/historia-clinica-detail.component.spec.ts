import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HistoriaClinicaDetailComponent } from './historia-clinica-detail.component';

describe('Component Tests', () => {
  describe('HistoriaClinica Management Detail Component', () => {
    let comp: HistoriaClinicaDetailComponent;
    let fixture: ComponentFixture<HistoriaClinicaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [HistoriaClinicaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ historiaClinica: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(HistoriaClinicaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(HistoriaClinicaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load historiaClinica on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.historiaClinica).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
