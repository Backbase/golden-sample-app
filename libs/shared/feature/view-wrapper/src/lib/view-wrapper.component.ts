import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './view-wrapper.component.html',
  styles: [],
  standalone: false,
})
export class ViewWrapperComponent {
  @Input()
  title: string;

  constructor(private route: ActivatedRoute) {
    this.title = this.route.snapshot.data['title'];
  }
}
