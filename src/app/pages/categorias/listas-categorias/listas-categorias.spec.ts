import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasCategorias } from './listas-categorias';

describe('ListasCategorias', () => {
  let component: ListasCategorias;
  let fixture: ComponentFixture<ListasCategorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListasCategorias],
    }).compileComponents();

    fixture = TestBed.createComponent(ListasCategorias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
