import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';

export interface I18nLabel {
  tag: string;
  lineNumber: number;
  fileName: string;
  label: string;
  meaning?: string;
  description?: string;
  id?: string;
  isValid: boolean;
}

@Component({
  selector: 'bb-i18n-viewer',
  templateUrl: './i18n-viewer.component.html',
  styleUrls: ['./i18n-viewer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule
  ]
})
export class I18nViewerComponent implements OnInit {
  @Input() set i18nLabels(value: I18nLabel[]) {
    this._i18nLabels = value;
    this.initializeDataSource();
  }
  get i18nLabels(): I18nLabel[] {
    return this._i18nLabels;
  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<I18nLabel>;

  displayedColumns: string[] = [
    'lineNumber',
    'fileName',
    'label',
    'meaning',
    'description',
    'id',
    'isValid',
    'actions'
  ];

  dataSource!: MatTableDataSource<I18nLabel>;
  private _i18nLabels: I18nLabel[] = [];

  ngOnInit() {
    this.initializeDataSource();
  }

  initializeDataSource() {
    this.dataSource = new MatTableDataSource(this.i18nLabels);
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    
    // Custom filter predicate to search across all fields
    this.dataSource.filterPredicate = (data: I18nLabel, filter: string) => {
      const searchStr = filter.toLowerCase();
      return (
        data.tag.toLowerCase().includes(searchStr) ||
        data.fileName.toLowerCase().includes(searchStr) ||
        data.label.toLowerCase().includes(searchStr) ||
        (data.meaning?.toLowerCase().includes(searchStr) ?? false) ||
        (data.description?.toLowerCase().includes(searchStr) ?? false) ||
        (data.id?.toLowerCase().includes(searchStr) ?? false)
      );
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewFullTag(tag: string) {
    // You could implement a modal or tooltip here
    console.log('Full tag:', tag);
  }

  getTooltipContent(label: I18nLabel): string {
    return `File: ${label.fileName}
Line: ${label.lineNumber}
Tag: ${label.tag}`;
  }

  getValidityColor(isValid: boolean): string {
    return isValid ? 'primary' : 'warn';
  }

  getValidityText(isValid: boolean): string {
    return isValid ? 'Valid' : 'Invalid';
  }
}
