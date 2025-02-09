import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  HomeOutline,
  UnorderedListOutline,
} from '@ant-design/icons-angular/icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { environment } from '../../../environments/environment';
import { MENU_ITEMS } from '../../constants/common';
import { AuthService } from '../../services/auth.service';

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
    NzDropDownModule,
    NzButtonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  providers: [provideNzIconsPatch([HomeOutline, UnorderedListOutline])],
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isCollapsed = false;
  appName = environment.appName;
  menuItems = MENU_ITEMS;
  profile: any = null;

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.profile = this.authService.getProfile();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
