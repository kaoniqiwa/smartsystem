import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraMgrComponent } from './camera-mgr.component';

describe('CameraMgrComponent', () => {
  let component: CameraMgrComponent;
  let fixture: ComponentFixture<CameraMgrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraMgrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraMgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
