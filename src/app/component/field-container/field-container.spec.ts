import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { FieldContainer } from './field-container';

describe('FieldsOutletComponent', () => {
  let component: FieldContainer;
  let fixture: ComponentFixture<FieldContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldContainer, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});