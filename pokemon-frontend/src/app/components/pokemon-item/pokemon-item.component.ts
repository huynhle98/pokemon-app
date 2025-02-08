import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HeartFill, HeartTwoTone } from '@ant-design/icons-angular/icons';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { IPokemonItem } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-item',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzBadgeModule,
  ],
  templateUrl: './pokemon-item.component.html',
  styleUrl: './pokemon-item.component.scss',
  providers: [provideNzIconsPatch([HeartTwoTone])],
})
export class PokemonItemComponent {
  pokemonItem = input<IPokemonItem | null>(null);

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  checkImg(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
