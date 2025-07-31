import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicfieldComponent } from './dynamicfield-component';

describe('DynamicfieldComponent', () => {
  let component: DynamicfieldComponent;
  let fixture: ComponentFixture<DynamicfieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicfieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
