import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishTripPage } from './publish-trip.page';

describe('PublishTripPage', () => {
  let component: PublishTripPage;
  let fixture: ComponentFixture<PublishTripPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishTripPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
