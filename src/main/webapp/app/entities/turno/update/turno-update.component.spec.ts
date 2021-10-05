jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TurnoService } from '../service/turno.service';
import { ITurno, Turno } from '../turno.model';

import { TurnoUpdateComponent } from './turno-update.component';

describe('Component Tests', () => {
  describe('Turno Management Update Component', () => {
    let comp: TurnoUpdateComponent;
    let fixture: ComponentFixture<TurnoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let turnoService: TurnoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TurnoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TurnoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TurnoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      turnoService = TestBed.inject(TurnoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const turno: ITurno = { id: 'CBA' };

        activatedRoute.data = of({ turno });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(turno));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const turno = { id: 'ABC' };
        spyOn(turnoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ turno });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: turno }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(turnoService.update).toHaveBeenCalledWith(turno);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const turno = new Turno();
        spyOn(turnoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ turno });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: turno }));
        saveSubject.complete();

        // THEN
        expect(turnoService.create).toHaveBeenCalledWith(turno);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const turno = { id: 'ABC' };
        spyOn(turnoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ turno });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(turnoService.update).toHaveBeenCalledWith(turno);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
