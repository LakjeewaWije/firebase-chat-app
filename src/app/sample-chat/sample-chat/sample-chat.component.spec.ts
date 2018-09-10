import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleChatComponent } from './sample-chat.component';

describe('SampleChatComponent', () => {
  let component: SampleChatComponent;
  let fixture: ComponentFixture<SampleChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
