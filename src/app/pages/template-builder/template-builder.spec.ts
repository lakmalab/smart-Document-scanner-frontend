import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateBuilder } from './template-builder';

describe('TemplateBuilder', () => {
  let component: TemplateBuilder;
  let fixture: ComponentFixture<TemplateBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
