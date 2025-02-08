import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  HeartFill,
  HeartOutline,
  MinusCircleOutline,
  PlusCircleOutline,
} from '@ant-design/icons-angular/icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzButtonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
  providers: [provideNzIconsPatch([PlusCircleOutline, MinusCircleOutline])],
})
export class PokemonDetailComponent {
  pokemonDetail = input<any | null>(null);
  favoriteChange = output();

  favoriteToggle(): void {
    this.favoriteChange.emit();
  }
}
