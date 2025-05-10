import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconButtonComponent } from './icon-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('IconButtonComponent', () => {
  let component: IconButtonComponent;
  let fixture: ComponentFixture<IconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IconButtonComponent,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IconButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit click event when button is clicked', () => {
    const spy = jest.spyOn(component.buttonClick, 'emit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should show default icon when not active', () => {
    component.defaultIcon = 'default';
    component.activeIcon = 'active';
    component.isActive = false;
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.textContent.trim()).toBe('default');
  });

  it('should show active icon when active', () => {
    component.defaultIcon = 'default';
    component.activeIcon = 'active';
    component.isActive = true;
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.textContent.trim()).toBe('active');
  });

  it('should have correct tooltip and aria-label', () => {
    const tooltip = 'Test Tooltip';
    const ariaLabel = 'Test Aria Label';

    component.tooltip = tooltip;
    component.ariaLabel = ariaLabel;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.attributes['ng-reflect-message']).toBe(tooltip);
    expect(button.attributes['aria-label']).toBe(ariaLabel);
  });

  it('should have active class when isActive is true', () => {
    component.isActive = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('active')).toBe(true);
  });

  it('should not have active class when isActive is false', () => {
    component.isActive = false;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('active')).toBe(false);
  });
});
