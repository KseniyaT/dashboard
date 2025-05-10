import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent {
  @Input() tooltip: string = '';
  @Input() ariaLabel: string = '';
  @Input() defaultIcon: string = '';
  @Input() activeIcon: string = '';
  @Input() isActive: boolean = false;
  @Input() disabled: boolean = false;
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    if (this.disabled) return;
    this.buttonClick.emit();
  }
}
