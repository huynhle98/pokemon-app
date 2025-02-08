import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchOutline } from '@ant-design/icons-angular/icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import * as Papa from 'papaparse';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PokemonItemComponent } from '../../components/pokemon-item/pokemon-item.component';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PokemonDetailComponent } from '../../components/pokemon-detail/pokemon-detail.component';
import { IPokemonItem } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzSelectModule,
    NzButtonModule,
    NzInputModule,
    PokemonItemComponent,
    NzPaginationModule,
    NzIconModule,
    NzSliderModule,
    NzInputNumberModule,
    NzModalModule,
    PokemonDetailComponent,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
  providers: [provideNzIconsPatch([SearchOutline])],
})
export class PokemonListComponent {
  // State variables
  pokemonList: any[] = []; // All Pokémon data
  filteredList = signal<any[]>([
    {
      name: '1',
      type: 'Pokemon-1',
      legendary: false,
      speed: 474,
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    },
    {
      name: '100',
      type: 'Pokemon-100',
      legendary: false,
      speed: 595,
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png',
    },
    {
      name: '100',
      type: 'Pokemon-100',
      legendary: false,
      speed: 595,
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png',
    },
    {
      name: '100',
      type: 'Pokemon-100',
      legendary: false,
      speed: 595,
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png',
    },
    {
      name: '100',
      type: 'Pokemon-100',
      legendary: false,
      speed: 595,
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png',
    },
  ]); // Filtered Pokémon list
  searchTerm: string = ''; // Search term
  searchDebounced$ = new BehaviorSubject<string>('');
  pageSize = 20; // Default page size

  types: string[] = ['Fire', 'Water', 'Grass', 'Electric']; // Pokémon types (simplified)
  legendaryStatus: boolean | null = null;
  minSpeed: number | null = null;
  maxSpeed: number | null = null;

  currentPage = 1; // Default page
  pageSizeDefault = 20;
  pageSizeOptions = [10, 20, 50, 100];

  //#region filters
  speedRangeValues = [1, 500];
  speedStep = 1;
  speedMin = 1;
  speedMax = 500;
  speedMinValue: number | null = null;
  speedMaxValue: number | null = null;
  speedMarks: { [key: number]: string } = {};
  //#endregion filters

  isDetailVisible = false;
  selectedPokemon = signal<IPokemonItem | null>(null);

  ngOnInit(): void {
    // Load Pokémon data from URL query params if applicable
    this.loadFromQueryParams();

    // Set up the search debounce
    this.searchDebounced$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.filterPokemon();
      });
  }

  // Handle CSV file import
  onImportCsv(event: any): void {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log(
            '🚀 ~ PokemonListComponent ~ onImportCsv ~ result:',
            result
          );
          this.pokemonList = (result.data as any[]).map(
            (row: any[]) => ({
              name: row[0],
              type: row[1],
              legendary: row[2] === 'true',
              speed: Number(row[4]),
              image: row[13], // Assuming columns are: name, type, legendary, speed, image
            })
            // (row: any[]) =>
            //   ({
            //     name: row[0],
            //     type: row[1],
            //     legendary: row[2] === 'true',
            //     speed: Number(row[3]),
            //     image: row[4], // Assuming columns are: name, type, legendary, speed, image
            //   })
          );
          this.filteredList.set([...this.pokemonList]);
          console.log(
            '🚀 ~ PokemonListComponent ~ onImportCsv ~ this.filteredList:',
            this.filteredList()
          );

          this.filterPokemon(); // Apply any active filters after loading
        },
        header: false,
      });
    }
  }

  // Filter Pokémon list based on search and advanced filters
  filterPokemon(): void {
    // const filteredList = this.pokemonList.filter((pokemon: any) => {
    //   const matchesSearchTerm = pokemon.name
    //     .toLowerCase()
    //     .includes(this.searchTerm.toLowerCase());
    //   const matchesType = this.types.length
    //     ? this.types.includes(pokemon.type)
    //     : true;
    //   const matchesLegendary =
    //     this.legendaryStatus !== null
    //       ? pokemon.legendary === this.legendaryStatus
    //       : true;
    //   const matchesSpeed =
    //     this.minSpeed !== null && this.maxSpeed !== null
    //       ? pokemon.speed >= this.minSpeed && pokemon.speed <= this.maxSpeed
    //       : true;

    //   return (
    //     matchesSearchTerm && matchesType && matchesLegendary && matchesSpeed
    //   );
    // });
    // this.filteredList.set(filteredList);
    console.log(
      '🚀 ~ PokemonListComponent ~ filterPokemon ~ this.filteredList:',
      this.filteredList()
    );
  }

  // Handle page size change
  onPageSizeChange(value: number): void {
    this.pageSize = value;
    this.currentPage = 1; // Reset to page 1 on page size change
  }

  // Handle page change
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  // Load query params if available
  loadFromQueryParams(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.searchTerm = urlParams.get('search') || '';
    this.legendaryStatus =
      urlParams.get('legendary') === 'true'
        ? true
        : urlParams.get('legendary') === 'false'
        ? false
        : null;
    this.minSpeed = urlParams.has('minSpeed')
      ? parseInt(urlParams.get('minSpeed') || '', 10)
      : null;
    this.maxSpeed = urlParams.has('maxSpeed')
      ? parseInt(urlParams.get('maxSpeed') || '', 10)
      : null;
    this.filterPokemon(); // Apply the filters from query params
  }

  toggleFavorite(): void {}

  openPokemonDetail(pokemon: IPokemonItem) {
    console.log(
      '🚀 ~ PokemonListComponent ~ openPokemonDetail ~ pokemon:',
      pokemon
    );
    this.selectedPokemon.set(pokemon);
    this.isDetailVisible = true;
  }

  closePokemonDetail(): void {
    this.selectedPokemon.set(null);
    this.isDetailVisible = false;
  }
}
