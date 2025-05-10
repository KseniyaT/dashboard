import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortButtonComponent } from './sort-button.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { SortDirection } from './sort-button.types';
import { By } from '@angular/platform-browser';

describe('SortButtonComponent', () => {
  let component: SortButtonComponent;
  let fixture: ComponentFixture<SortButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SortButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.sortField).toBe('');
    expect(component.currentDirection).toBe('desc');
    expect(component.disabled).toBeFalsy();
  });

  it('should toggle sort direction when clicked', () => {
    // Initial state
    expect(component.currentDirection).toBe('desc');

    // First click - change to asc
    component.onSort();
    expect(component.currentDirection).toBe('asc');

    // Second click - change back to desc
    component.onSort();
    expect(component.currentDirection).toBe('desc');
  });

  it('should emit sort direction change', () => {
    const sortSpy = jest.spyOn(component.sortChange, 'emit');

    // Initial state is desc
    expect(component.currentDirection).toBe('desc');

    // Click to change to asc
    component.onSort();
    expect(sortSpy).toHaveBeenCalledWith('asc');

    // Click to change back to desc
    component.onSort();
    expect(sortSpy).toHaveBeenCalledWith('desc');
  });

  it('should not change direction when disabled', () => {
    component.disabled = true;
    const sortSpy = jest.spyOn(component.sortChange, 'emit');

    // Try to change direction
    component.onSort();

    // Direction should not change and no event should be emitted
    expect(component.currentDirection).toBe('desc');
    expect(sortSpy).not.toHaveBeenCalled();
  });

  it('should pass correct props to IconButtonComponent', () => {
    const sortField = 'name';
    const currentDirection: SortDirection = 'asc';
    component.sortField = sortField;
    component.currentDirection = currentDirection;

    fixture.detectChanges();

    const iconButton = fixture.debugElement.query(By.directive(IconButtonComponent));
    expect(iconButton).toBeTruthy();

    const iconButtonComponent = iconButton.componentInstance as IconButtonComponent;
    expect(iconButtonComponent.tooltip).toBe(`Sort by ${sortField}`);
    expect(iconButtonComponent.ariaLabel).toBe(`Sort by ${sortField}`);
    expect(iconButtonComponent.defaultIcon).toBe('arrow_downward');
    expect(iconButtonComponent.activeIcon).toBe('arrow_upward');
    expect(iconButtonComponent.isActive).toBe(currentDirection === 'asc');
  });

  it('should handle disabled state in IconButtonComponent', () => {
    component.disabled = true;
    fixture.detectChanges();

    const iconButton = fixture.debugElement.query(By.directive(IconButtonComponent));
    const iconButtonComponent = iconButton.componentInstance as IconButtonComponent;
    expect(iconButtonComponent.disabled).toBeTruthy();
  });
});
