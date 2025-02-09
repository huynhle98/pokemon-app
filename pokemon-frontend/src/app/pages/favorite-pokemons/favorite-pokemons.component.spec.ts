import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritePokemonsComponent } from './favorite-pokemons.component';

describe('FavoritePokemonsComponent', () => {
  let component: FavoritePokemonsComponent;
  let fixture: ComponentFixture<FavoritePokemonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritePokemonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritePokemonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
