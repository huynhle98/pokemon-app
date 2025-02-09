import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { LoadingOutline } from '@ant-design/icons-angular/icons';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PokemonDetailComponent } from '../../components/pokemon-detail/pokemon-detail.component';
import { PokemonItemComponent } from '../../components/pokemon-item/pokemon-item.component';
import { IPokemonItem } from '../../interfaces/pokemon.interface';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PokemonsService } from '../../services/pokemons.service';
import { catchError, finalize, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorite-pokemons',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    PokemonDetailComponent,
    PokemonItemComponent,
    NzModalModule,
    NzEmptyModule,
  ],
  templateUrl: './favorite-pokemons.component.html',
  styleUrl: './favorite-pokemons.component.scss',
  providers: [provideNzIconsPatch([LoadingOutline])],
})
export class FavoritePokemonsComponent implements OnInit {
  private messageService = inject(NzMessageService);
  private pokemonsService = inject(PokemonsService);
  private authService = inject(AuthService);

  isLoadingData = false;
  data = signal<IPokemonItem[]>([]);
  isDetailVisible = false;
  selectedPokemon = signal<IPokemonItem | null>(null);

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    const profile = this.authService.getProfile();
    const userId = profile?.['sub'];
    this.isLoadingData = true;
    this.pokemonsService
      .getFavorites(userId)
      .pipe(
        catchError((err) => {
          this.messageService.error('Failed to get data');
          return throwError(() => err);
        }),
        finalize(() => {
          this.isLoadingData = false;
        })
      )
      .subscribe((res: IPokemonItem[]) => {
        this.data.set(res || []);
        this.messageService.success('Get data successfully');
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

  toggleFavorite(newItem: IPokemonItem): void {
    this.data.update((items: IPokemonItem[]) => {
      const index = items.findIndex((p) => p.id === newItem.id);
      if (index !== -1) {
        items[index].isFavorite = !items[index].isFavorite;
      }
      return items.filter((item) => !item.isFavorite);
    });
  }
}
