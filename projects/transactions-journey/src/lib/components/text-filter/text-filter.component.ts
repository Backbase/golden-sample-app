import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bb-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.css']
})
export class TextFilterComponent implements OnInit {

  @Output() textChange: EventEmitter<string> = new EventEmitter();

  text = '';

  constructor() { }

  ngOnInit(): void {
  }

}
