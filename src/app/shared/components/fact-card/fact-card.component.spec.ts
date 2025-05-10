import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FactCardComponent } from './fact-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { IFactResponse } from '@core/models/fact-response.interface';
import { IconButtonComponent } from '@shared/components/icon-button/icon-button.component';

describe('FactCardComponent', () => {
  let component: FactCardComponent;
  let fixture: ComponentFixture<FactCardComponent>;
  let mockFact: IFactResponse;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        FactCardComponent,
        IconButtonComponent,
      ],
    }).compileComponents();

    mockFact = {
      id: '1',
      text: 'Test fact',
      source: 'Test source',
      createdAt: '2024-03-11T20:17:07.411Z',
    };

    fixture = TestBed.createComponent(FactCardComponent);
    component = fixture.componentInstance;
    component.fact = mockFact;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display fact text', () => {
    const factText = fixture.debugElement.query(By.css('.fact-text'))?.nativeElement;
    expect(factText).toBeTruthy();
    expect(factText.textContent).toContain(mockFact.text);
  });

  it('should emit favoriteClick event when favorite button is clicked', async () => {
    jest.spyOn(component.favoriteClick, 'emit');
    await fixture.whenStable();
    fixture.detectChanges();

    const favoriteButton = fixture.debugElement.query(By.directive(IconButtonComponent));
    expect(favoriteButton).toBeTruthy();
    favoriteButton.triggerEventHandler('buttonClick', null);
    expect(component.favoriteClick.emit).toHaveBeenCalledWith(mockFact);
  });

  it('should emit deleteClick event when delete button is clicked', () => {
    component.showDeleteButton = true;
    jest.spyOn(component.deleteClick, 'emit');
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.queryAll(By.directive(IconButtonComponent))[1];
    expect(deleteButton).toBeTruthy();
    deleteButton.triggerEventHandler('buttonClick', null);
    expect(component.deleteClick.emit).toHaveBeenCalledWith(mockFact);
  });
});
