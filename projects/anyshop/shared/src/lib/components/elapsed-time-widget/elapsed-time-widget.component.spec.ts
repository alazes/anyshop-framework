import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ElapsedTimeWidgetComponent } from './elapsed-time-widget.component';

describe('ElapsedTimeWidgetComponent', () => {
  let component: ElapsedTimeWidgetComponent;
  let fixture: ComponentFixture<ElapsedTimeWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ElapsedTimeWidgetComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ElapsedTimeWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
