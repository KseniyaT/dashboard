import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { SortDirection } from './sort-button.types';

@Component({
  selector: 'app-sort-button',
  standalone: true,
  imports: [IconButtonComponent],
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss'],
})
export class SortButtonComponent {
  @Input() sortField: string = '';
  @Input() currentDirection: SortDirection = 'desc';
  @Input() disabled: boolean = false;
  @Output() sortChange = new EventEmitter<SortDirection>();

  onSort(): void {
    if (this.disabled) return;
    this.currentDirection = this.currentDirection === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit(this.currentDirection);
  }
}
