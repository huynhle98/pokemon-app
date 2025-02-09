import { CommonModule } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import {
  HeartFill,
  HeartOutline,
  MinusCircleOutline,
  PlusCircleOutline,
} from '@ant-design/icons-angular/icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { PokemonsService } from '../../services/pokemons.service';
import { AuthService } from '../../services/auth.service';
import { IPokemonItem } from '../../interfaces/pokemon.interface';
import { catchError, throwError } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzButtonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
  providers: [provideNzIconsPatch([PlusCircleOutline, MinusCircleOutline])],
})
export class PokemonDetailComponent {
  private pokemonsService = inject(PokemonsService);
  private authService = inject(AuthService);
  private messageService = inject(NzMessageService);

  pokemonDetail = model<IPokemonItem | null>(null);
  favoriteChange = output<IPokemonItem>();

  favoriteToggle(): void {
    const profile = this.authService.getProfile();
    const userId = profile?.['sub'];
    const pokemonId = this.pokemonDetail()?.id || '';
    const isFavorite = this.pokemonDetail()?.isFavorite;
    this.pokemonsService[isFavorite ? 'removeFavorite' : 'addFavorite'](
      userId,
      pokemonId
    )
      .pipe(
        catchError((err) => {
          this.messageService.error('Failed to toggle favorites');
          return throwError(() => err);
        })
      )
      .subscribe((res: IPokemonItem) => {
        if (!res) {
          this.messageService.error('Failed to toggle favorites');
          return;
        }

        this.pokemonDetail.set(res);
        this.messageService.success('Toggle favorites Successfully');
        this.favoriteChange.emit(res);
      });
  }
}
