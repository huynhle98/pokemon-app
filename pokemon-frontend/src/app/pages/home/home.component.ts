import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { catchError, throwError } from 'rxjs';
import { PokemonDetailComponent } from '../../components/pokemon-detail/pokemon-detail.component';
import { PokemonItemComponent } from '../../components/pokemon-item/pokemon-item.component';
import { IPokemonItem } from '../../interfaces/pokemon.interface';
import { SafePipe } from '../../pipes/safe.pipe';
import { PokemonsService } from '../../services/pokemons.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NzCarouselModule,
    SafePipe,
    NzCardModule,
    NzBadgeModule,
    PokemonItemComponent,
    NzModalModule,
    PokemonDetailComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private pokemonsService = inject(PokemonsService);
  private messageService = inject(NzMessageService);

  selectedPokemon = signal<IPokemonItem | null>(null);
  isDetailVisible = false;
  array = [1, 2, 3, 4];
  effect = 'scrollx';
  // Placeholder Pokémon data for the first 10
  pokemonList: IPokemonItem[] = [];

  // Placeholder video URLs for the carousel
  videoUrls = [
    'https://www.youtube.com/embed/uBYORdr_TY8', // Replace with actual YouTube video trailer URLs
  ];

  ngOnInit(): void {
    this.getPokemons();
  }

  getPokemons(): void {
    const _queryParams: { [key: string]: any } = {
      limit: 10,
    };
    const queryParams = new URLSearchParams();
    Object.keys(_queryParams).forEach((key) => {
      queryParams.append(key, _queryParams[key] || '');
    });

    this.pokemonsService
      .getList(queryParams.toString())
      .pipe(
        catchError((err) => {
          this.messageService.error('Failed to fetch Pokémon data');
          return throwError(() => err);
        })
      )
      .subscribe((res) => {
        if (!res?.data?.length) {
          this.pokemonList = [];
        }

        this.pokemonList = res.data;
        this.videoUrls = res.data
          .slice(0, 4)
          .map((item: IPokemonItem) =>
            item.ytbUrl?.replace('youtu.be', 'www.youtube.com/embed')
          );
      });
  }

  openPokemonDetail(pokemon: IPokemonItem) {
    this.selectedPokemon.set(pokemon);
    this.isDetailVisible = true;
  }

  closePokemonDetail(): void {
    this.selectedPokemon.set(null);
    this.isDetailVisible = false;
  }

  toggleFavorite(): void {}
}
