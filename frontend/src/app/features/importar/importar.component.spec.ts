import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarComponent } from './importar.component';

describe('Importar', () => {
  let component: ImportarComponent;
  let fixture: ComponentFixture<ImportarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
