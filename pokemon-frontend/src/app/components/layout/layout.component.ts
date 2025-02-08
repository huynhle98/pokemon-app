import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  HomeOutline,
  UnorderedListOutline,
} from '@ant-design/icons-angular/icons';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { environment } from '../../../environments/environment';
import { MENU_ITEMS } from '../../constants/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  providers: [provideNzIconsPatch([HomeOutline, UnorderedListOutline])],
})
export class LayoutComponent {
  isCollapsed = false;
  appName = environment.appName;
  menuItems = MENU_ITEMS;
}
