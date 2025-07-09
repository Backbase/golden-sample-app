import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './view-wrapper.component.html',
  styles: [],
  standalone: false,
})
export class ViewWrapperComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  @Input()
  title: string;

  constructor() {
    this.title = this.route.snapshot.data['title'];
  }
}
