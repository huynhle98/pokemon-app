import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule, NzSpinModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  loading = input(false);
}
