import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { SafePipe } from '../../pipes/safe.pipe';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NzCarouselModule,
    SafePipe,
    NzCardModule,
    NzBadgeModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  array = [1, 2, 3, 4];
  effect = 'scrollx';
  // Placeholder Pokémon data for the first 10
  pokemonList = [
    {
      name: 'Pikachu',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    },
    {
      name: 'Bulbasaur',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    },
    {
      name: 'Charmander',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    },
    {
      name: 'Squirtle',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    },
    {
      name: 'Eevee',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
    },
    {
      name: 'Jigglypuff',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png',
    },
    {
      name: 'Meowth',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png',
    },
    {
      name: 'Pidgey',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png',
    },
    {
      name: 'Machop',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png',
    },
    {
      name: 'Snorlax',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png',
    },
  ];

  // Placeholder video URLs for the carousel
  videoUrls = [
    'https://www.youtube.com/embed/ZK7jUJ3ckj0', // Replace with actual YouTube video trailer URLs
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/VbfpW0pbvaU',
    'https://www.youtube.com/embed/2Vv-BfVoq4g',
  ];
}
