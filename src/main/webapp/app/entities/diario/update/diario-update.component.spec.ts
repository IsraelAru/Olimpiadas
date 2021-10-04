jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DiarioService } from '../service/diario.service';
import { IDiario, Diario } from '../diario.model';

import { DiarioUpdateComponent } from './diario-update.component';

describe('Component Tests', () => {
  describe('Diario Management Update Component', () => {
    let comp: DiarioUpdateComponent;
    let fixture: ComponentFixture<DiarioUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let diarioService: DiarioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DiarioUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DiarioUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DiarioUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      diarioService = TestBed.inject(DiarioService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const diario: IDiario = { id: 'CBA' };

        activatedRoute.data = of({ diario });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(diario));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const diario = { id: 'ABC' };
        spyOn(diarioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ diario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: diario }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(diarioService.update).toHaveBeenCalledWith(diario);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const diario = new Diario();
        spyOn(diarioService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ diario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: diario }));
        saveSubject.complete();

        // THEN
        expect(diarioService.create).toHaveBeenCalledWith(diario);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const diario = { id: 'ABC' };
        spyOn(diarioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ diario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(diarioService.update).toHaveBeenCalledWith(diario);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
