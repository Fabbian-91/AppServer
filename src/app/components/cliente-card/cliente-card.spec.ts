import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCard } from './cliente-card';

describe('ClienteCard', () => {
  let component: ClienteCard;
  let fixture: ComponentFixture<ClienteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
