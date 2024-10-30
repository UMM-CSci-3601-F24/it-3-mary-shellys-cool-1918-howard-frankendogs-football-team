import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Location } from '@angular/common';
import { AddWordComponent } from './add-word.component';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WordService } from './word.service';
import { MockWordService } from 'src/testing/word.service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { WordListComponent } from './word-list.component';

describe('AddWordComponent', () => {
  let addWordComponent: AddWordComponent;
  let addWordForm: FormGroup;
  let fixture: ComponentFixture<AddWordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(WordService, { useValue: new MockWordService() });
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        AddWordComponent
      ],
    })
    .compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWordComponent);
    addWordComponent = fixture.componentInstance;
    fixture.detectChanges();
    addWordForm = addWordComponent.addWordForm;
    expect(addWordForm).toBeDefined();
    expect(addWordForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(addWordComponent).toBeTruthy();
    expect(addWordForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(addWordForm.valid).toBeFalsy();
  });

  describe('the word group field', () => {
    let wordControl: AbstractControl;

    beforeEach(() => {
      wordControl = addWordComponent.addWordForm.controls.word;
    });

    it('should not allow empty names', () => {
      wordControl.setValue('');
      expect(wordControl.valid).toBeFalsy();
    });
    it('should allow Foods as a word group name', () => {
      wordControl.setValue('Foods');
      expect(wordControl.valid).toBeTruthy();
    })
  })

  describe('the new words field', () => {
    let wordGroupControl: AbstractControl;

    beforeEach(() => {
      wordGroupControl = addWordComponent.addWordForm.controls.wordGroup;
    })

    it('should not allow empty inputs', () => {
      wordGroupControl.setValue('');
      expect(wordGroupControl.valid).toBeFalsy();
    });
    it('should allow input `burger, fries, milkshake`', () => {
      wordGroupControl.setValue('burger, fries, milkshake');
      expect(wordGroupControl.valid).toBeTruthy();
    });
  });

  describe('getErrorMessage()', () => {
    it('should return correct error messages', () => {
      let controlName: keyof typeof addWordComponent.addWordValidationMessages = 'word';
      addWordComponent.addWordForm.get(controlName).setErrors({'required': true});
      expect(addWordComponent.getErrorMessage(controlName)).toEqual('Please enter words to be added');

      controlName = 'wordGroup';
      addWordComponent.addWordForm.get(controlName).setErrors({'required': true});
      expect(addWordComponent.getErrorMessage(controlName)).toEqual('Word group name is required');
    });

    it('should return "Unknown error" if no error message is found', () => {
      const controlName: keyof typeof addWordComponent.addWordValidationMessages = 'word';
      addWordComponent.addWordForm.get(controlName).setErrors({'unknown': true});
      expect(addWordComponent.getErrorMessage(controlName)).toEqual('Unknown error');
    });
  });
});

  describe('AddWordComponent form submission()', () => {
    let component: AddWordComponent;
    let fixture: ComponentFixture<AddWordComponent>;
    let wordService: WordService;
    let location: Location;

    beforeEach(() => {
      TestBed.overrideProvider(WordService, {
        useValue: new MockWordService(),
      });
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          MatSelectModule,
          MatInputModule,
          BrowserAnimationsModule,
          RouterTestingModule.withRoutes([{ path: 'anagram' , component: WordListComponent}]),
          AddWordComponent,
        ],
        providers: [
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
        ],
      })
        .compileComponents()
        .catch((error) => {
          expect(error).toBeNull();
        });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(AddWordComponent);
      component = fixture.componentInstance;
      wordService = TestBed.inject(WordService);
      location = TestBed.inject(Location);

      TestBed.inject(Router);
      TestBed.inject(HttpTestingController);
      fixture.detectChanges();
    });

    beforeEach(() => {
      component.addWordForm.controls.word.setValue('pizza');
      component.addWordForm.controls.wordGroup.setValue('Foods');
    });

    it('should call addWord() and handle success response', fakeAsync(() => {
      fixture.ngZone.run(() => {
        const addWordSpy = spyOn(wordService, 'addWord').and.returnValue(of(''));
        component.submitForm();
        expect(addWordSpy).toHaveBeenCalledWith(component.addWordForm.value);
        tick();
        expect(location.path()).toBe('/anagram');
        flush();
      });
    }));

    it('should call addWord() and handle error response', () => {
      const path = location.path();
      const errorResponse = { status: 500, message: 'Server error' };
      const addWordSpy = spyOn(wordService, 'addWord').and.returnValue(
        throwError(() => errorResponse)
      );
      component.submitForm();
      expect(addWordSpy).toHaveBeenCalledWith(component.addWordForm.value);

      expect(location.path()).toBe(path);
    });
  });
