import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IFactResponse } from '@core/models/fact-response.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  const mockItems: IFactResponse[] = [
    {
      id: '1',
      text: 'Test fact 1',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      text: 'Test fact 2',
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
        SearchComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    component.items = mockItems;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all items initially', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.filteredItems).toEqual(mockItems);
  });

  it('should filter items based on search text', async () => {
    component.searchControl.setValue('Test fact 1');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.filteredItems.length).toBe(2);
    expect(component.filteredItems[0].text).toBe('Test fact 1');
  });

  it('should show all items when search text is empty', async () => {
    component.searchControl.setValue('');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.filteredItems).toEqual([...mockItems]);
  });

  it('should emit itemSelected event when item is clicked', async () => {
    const selectedItem = mockItems[0];
    jest.spyOn(component.itemSelected, 'emit');
    component.searchControl.setValue(selectedItem.text);
    await fixture.whenStable();
    fixture.detectChanges();
    const event = { option: { value: selectedItem.text } } as MatAutocompleteSelectedEvent;
    component.onItemSelected(event);
    expect(component.itemSelected.emit).toHaveBeenCalledWith(selectedItem);
  });

  it('should clear filtered items when search is cleared', async () => {
    component.searchControl.setValue('Test fact 1');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.filteredItems.length).toBe(2);
    component.clearSearch();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.filteredItems).toEqual([...mockItems]);
  });

  it('should handle null items array', () => {
    component.items = null as any;
    component.filterItems('anything');
    expect(component.filteredItems).toEqual([]);
  });

  it('should handle empty items array', () => {
    component.items = [];
    component.filterItems('anything');
    expect(component.filteredItems).toEqual([]);
  });

  it('should filter items with exact match', () => {
    component.items = [
      { id: '1', text: 'Test fact 1', createdAt: '' },
      { id: '2', text: 'Another fact', createdAt: '' },
    ];
    component.filterItems('Test fact 1');
    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].text).toBe('Test fact 1');
  });

  it('should filter items with case-insensitive match', () => {
    component.items = [
      { id: '1', text: 'Test fact 1', createdAt: '' },
      { id: '2', text: 'Another fact', createdAt: '' },
    ];
    component.filterItems('TEST FACT 1');
    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].text).toBe('Test fact 1');
  });

  it('should filter items with partial match', () => {
    component.items = [
      { id: '1', text: 'Test fact 1', createdAt: '' },
      { id: '2', text: 'Another fact', createdAt: '' },
    ];
    component.filterItems('fact');
    expect(component.filteredItems.length).toBe(2);
    expect(component.filteredItems[0].text).toBe('Test fact 1');
    expect(component.filteredItems[1].text).toBe('Another fact');
  });

  it('should set filteredItems to [] if items is undefined', () => {
    component.items = undefined as any;
    component.filterItems('anything');
    expect(component.filteredItems).toEqual([]);
  });

  it('should filter items case-insensitively', () => {
    component.items = mockItems;
    component.filterItems('test FACT 1');
    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].text).toBe('Test fact 1');
  });

  it('should not emit itemSelected if no matching item is found', () => {
    jest.spyOn(component.itemSelected, 'emit');
    const event = { option: { value: 'Nonexistent fact' } } as MatAutocompleteSelectedEvent;
    component.onItemSelected(event);
    expect(component.itemSelected.emit).not.toHaveBeenCalled();
  });

  it('should set filteredItems to [] if no items match the search', () => {
    component.items = mockItems;
    component.filterItems('no match');
    expect(component.filteredItems).toEqual([]);
  });

  it('should filter multiple items if more than one matches', () => {
    component.items = [
      { id: '1', text: 'Test', createdAt: '' },
      { id: '2', text: 'Test fact', createdAt: '' },
      { id: '3', text: 'Another', createdAt: '' },
    ];
    component.filterItems('Test');
    expect(component.filteredItems.length).toBe(2);
    expect(component.filteredItems[0].text).toContain('Test');
    expect(component.filteredItems[1].text).toContain('Test');
  });
});
