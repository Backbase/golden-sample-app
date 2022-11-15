import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './view-wrapper.component.html',
  styles: [],
})
export class ViewWrapperComponent {
  @Input()
  title = this.route.snapshot.data['title'];

  constructor(private route: ActivatedRoute) { }
}
