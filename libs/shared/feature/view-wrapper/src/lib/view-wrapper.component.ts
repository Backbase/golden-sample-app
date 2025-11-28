import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  templateUrl: './view-wrapper.component.html',
  styles: [],
  imports: [RouterOutlet],
})
export class ViewWrapperComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  @Input()
  title: string;

  constructor() {
    this.title = this.route.snapshot.data['title'];
  }
}
