import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingOutline, SearchOutline } from '@ant-design/icons-angular/icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
} from 'rxjs/operators';
import { PokemonDetailComponent } from '../../components/pokemon-detail/pokemon-detail.component';
import { PokemonItemComponent } from '../../components/pokemon-item/pokemon-item.component';
import { IPokemonItem } from '../../interfaces/pokemon.interface';
import { PokemonsService } from '../../services/pokemons.service';
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
    NzEmptyModule,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
  providers: [provideNzIconsPatch([SearchOutline, LoadingOutline])],
})
export class PokemonListComponent {
  private messageService = inject(NzMessageService);
  private pokemonsService = inject(PokemonsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // State variables
  pokemonList: any[] = []; // All Pokémon data
  filteredList = signal<any[]>([]); // Filtered Pokémon list
  searchTerm: string = ''; // Search term
  searchDebounced$ = new BehaviorSubject<string>('');

  types: string[] = []; // Pokémon types (simplified)
  legendaryStatus: boolean | null = null;
  minSpeed: number | null = null;
  maxSpeed: number | null = null;

  currentPage = 1; // Default page
  pageSizeDefault = 20;
  totalResults = 0;
  pageSizeOptions = [10, 20, 50, 100];

  //#region filters
  speedRangeValues = [1, 500];
  speedStep = 1;
  speedMin = 1;
  speedMax = 500;
  speedMinValue: number | null = null;
  speedMaxValue: number | null = null;
  speedMarks: { [key: number]: string } = {};
  queryParams: {
    name?: string | null;
    type?: string | null;
    legendary?: string | null;
    minSpeed?: string | null;
    maxSpeed?: string | null;
    limit?: number;
    offset?: number;
    [key: string]: any;
  } = {};
  selectedType: string | null = null;
  selectedLegendary: boolean | null = null;
  //#endregion filters

  isDetailVisible = false;
  selectedPokemon = signal<IPokemonItem | null>(null);

  isImporting = false;
  isLoadingData = false;

  ngOnInit(): void {
    // Load Pokémon data from URL query params if applicable
    this.getPokemonsTypes();
    this.loadFromQueryParams();
    this.handleSearch();
  }

  handleSearch(): void {
    // Set up the search debounce
    this.searchDebounced$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.queryParams.name = term;
        this.updateQueryParams();
        this.getPokemons();
      });
  }

  getPokemonsTypes(): void {
    this.pokemonsService
      .getTypes()
      .pipe(
        catchError((err) => {
          this.messageService.error('Failed to retrieve Pokémon types');
          return throwError(() => err);
        })
      )
      .subscribe((types: string[]) => {
        this.types = types;
      });
  }

  // Handle CSV file import
  onImportCsv(event: any, el: HTMLInputElement): void {
    const file = event.target.files[0];
    if (!file) {
      this.messageService.error('Uploaded file not found');
      return;
    }
    this.isImporting = true;
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.pokemonsService
      .uploadFile(formData)
      .pipe(
        catchError((err) => {
          this.messageService.error('Failed to upload file');
          return throwError(() => err);
        }),
        finalize(() => {
          el.value = '';
          this.isImporting = false;
        })
      )
      .subscribe((res) => {
        this.messageService.success(
          res?.message || 'Uploaded file successfully'
        );
        this.getPokemons();
      });
  }

  // Filter Pokémon list based on search and advanced filters
  filterPokemon(): void {
    const filteredList = this.pokemonList.filter((pokemon: any) => {
      const matchesSearchTerm = pokemon.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesType = this.types.length
        ? this.types.includes(pokemon.type)
        : true;
      const matchesLegendary =
        this.legendaryStatus !== null
          ? pokemon.legendary === this.legendaryStatus
          : true;
      const matchesSpeed =
        this.minSpeed !== null && this.maxSpeed !== null
          ? pokemon.speed >= this.minSpeed && pokemon.speed <= this.maxSpeed
          : true;
      return (
        matchesSearchTerm && matchesType && matchesLegendary && matchesSpeed
      );
    });
    // this.filteredList.set(filteredList);
  }

  // Handle page size change
  onPageSizeChange(value: number): void {
    this.pageSizeDefault = value;
    this.queryParams.limit = value;
    this.currentPage = 1; // Reset to page 1 on page size change
    this.queryParams.offset = 0;
    this.getPokemons();
  }

  // Handle page change
  onPageChange(page: number): void {
    this.currentPage = page;
    this.queryParams.offset = page - 1;
    this.getPokemons();
  }

  // Load query params if available
  loadFromQueryParams(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.searchTerm = urlParams.get('search') || '';
    this.queryParams = {
      name: urlParams.get('name') || null,
      type: urlParams.get('type') || null,
      legendary: urlParams.get('legendary') || null,
      minSpeed: urlParams.get('minSpeed') || null,
      maxSpeed: urlParams.get('maxSpeed') || null,
      limit: this.pageSizeDefault,
      offset: 0,
    };
    this.selectedLegendary = this.queryParams.legendary
      ? Boolean(this.queryParams.legendary)
      : null;
    this.selectedType = this.queryParams.type || null;
    this.speedMinValue = this.queryParams.minSpeed
      ? Number(this.queryParams.minSpeed)
      : null;
    this.maxSpeed = this.queryParams.maxSpeed
      ? Number(this.queryParams.maxSpeed)
      : null;

    this.getPokemons(); // Apply the filters from query params
  }

  getPokemons(): void {
    const queryString = this.getQueryParamsString();
    this.isLoadingData = true;
    this.pokemonsService
      .getList(queryString)
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        }),
        finalize(() => {
          this.isLoadingData = false;
        })
      )
      .subscribe((res) => {
        if (!res?.data?.length) {
          this.filteredList.set([]);
          return;
        }

        this.filteredList.set(res.data);
        this.totalResults = res.totalPokemons;
      });
  }

  toggleFavorite(newItem: IPokemonItem): void {
    this.filteredList.update((items: IPokemonItem[]) => {
      const index = items.findIndex((p) => p.id === newItem.id);
      if (index !== -1) {
        items[index].isFavorite = !items[index].isFavorite;
      }
      return items;
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

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.queryParams,
      },
      queryParamsHandling: 'merge', // Merge with existing query params
    });
  }

  getQueryParamsString(): string {
    const queryParams = new URLSearchParams();
    Object.keys(this.queryParams).forEach((key) => {
      queryParams.append(key, this.queryParams[key] || '');
    });

    return queryParams.toString();
  }

  onLegendaryStatusChange(value: boolean): void {
    this.queryParams.legendary = value ? 'true' : 'false';
    this.updateQueryParams();
    this.getPokemons();
  }

  onTypeChange(value: string): void {
    this.queryParams.type = value;
    this.updateQueryParams();
    this.getPokemons();
  }

  onSpeedRangeChange(isMin = true): void {
    if (
      this.speedMinValue &&
      this.speedMaxValue &&
      this.speedMinValue > this.speedMaxValue
    ) {
      setTimeout(() => {
        if (isMin) {
          this.speedMinValue = this.speedMaxValue;
        } else {
          this.speedMaxValue = this.speedMinValue;
        }
        this.updateSpeedQuery();
      });
    } else {
      this.updateSpeedQuery();
    }
  }

  private updateSpeedQuery(): void {
    this.queryParams.minSpeed = String(this.speedMinValue || '');
    this.queryParams.maxSpeed = String(this.speedMaxValue || '');
    this.updateQueryParams();
    this.getPokemons();
  }
}
