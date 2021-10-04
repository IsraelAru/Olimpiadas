import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DiarioDetailComponent } from './diario-detail.component';

describe('Component Tests', () => {
  describe('Diario Management Detail Component', () => {
    let comp: DiarioDetailComponent;
    let fixture: ComponentFixture<DiarioDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DiarioDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ diario: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(DiarioDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DiarioDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load diario on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.diario).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
