import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileToken } from './mobile-token';

describe('MobileToken', () => {
  let component: MobileToken;
  let fixture: ComponentFixture<MobileToken>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileToken]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileToken);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
