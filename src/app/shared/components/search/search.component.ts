import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IFactResponse } from '@core/models/fact-response.interface';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() items: IFactResponse[] = [];
  @Output() search = new EventEmitter<string>();
  @Output() itemSelected = new EventEmitter<IFactResponse>();

  searchText = '';
  searchControl = new FormControl('');
  filteredItems: IFactResponse[] = [];

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => {
        this.searchText = value || '';
        this.filterItems(this.searchText);
        this.onSearch();
      });
  }

  ngOnInit(): void {
    this.filterItems(this.searchText);
  }

  onSearch(): void {
    this.search.emit(this.searchText);
  }

  onItemSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedText = event.option.value;
    const selectedFact = this.items.find(item => item.text === selectedText);
    if (selectedFact) {
      this.searchText = selectedText;
      this.searchControl.setValue(selectedText);
      this.itemSelected.emit(selectedFact);
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.searchControl.setValue('', { emitEvent: false });
    this.filterItems('');
    this.search.emit('');
    this.itemSelected.emit(null as any);
  }

  filterItems(searchText: string): void {
    if (!this.items || this.items.length === 0) {
      this.filteredItems = [];
      return;
    }
    if (!searchText) {
      this.filteredItems = [...this.items];
      return;
    }
    const searchLower = searchText.toLowerCase();
    this.filteredItems = this.items.filter(item => item.text.toLowerCase().includes(searchLower));
  }
}
