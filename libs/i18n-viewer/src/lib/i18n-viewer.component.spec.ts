import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { I18nViewerComponent } from './i18n-viewer.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('I18nViewerComponent', () => {
  let component: I18nViewerComponent;
  let fixture: ComponentFixture<I18nViewerComponent>;

  const mockI18nLabels = [
    {
      tag: '<button i18n="meaning|description@@buttonId">Click me</button>',
      lineNumber: 1,
      fileName: 'test.component.html',
      label: 'Click me',
      meaning: 'meaning',
      description: 'description',
      id: 'buttonId',
      isValid: true
    },
    {
      tag: '<span i18n="@@spanId">Invalid format</span>',
      lineNumber: 2,
      fileName: 'test.component.html',
      label: 'Invalid format',
      id: 'spanId',
      isValid: false
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatTooltipModule,
        I18nViewerComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(I18nViewerComponent);
    component = fixture.componentInstance;
    component.i18nLabels = mockI18nLabels;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of rows', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('tr.mat-row');
    expect(tableRows.length).toBe(mockI18nLabels.length);
  });

  it('should apply filter correctly', () => {
    const event = { target: { value: 'Click me' } } as any;
    component.applyFilter(event);
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].label).toBe('Click me');
  });

  it('should display validity status correctly', () => {
    const validChip = fixture.nativeElement.querySelector('mat-chip');
    expect(validChip.textContent.trim()).toBe('Valid');
  });

  it('should generate correct tooltip content', () => {
    const tooltipContent = component.getTooltipContent(mockI18nLabels[0]);
    expect(tooltipContent).toContain('test.component.html');
    expect(tooltipContent).toContain('Line: 1');
    expect(tooltipContent).toContain(mockI18nLabels[0].tag);
  });

  it('should return correct validity color', () => {
    expect(component.getValidityColor(true)).toBe('primary');
    expect(component.getValidityColor(false)).toBe('warn');
  });

  it('should return correct validity text', () => {
    expect(component.getValidityText(true)).toBe('Valid');
    expect(component.getValidityText(false)).toBe('Invalid');
  });
});
