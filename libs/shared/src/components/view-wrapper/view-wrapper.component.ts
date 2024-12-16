import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  templateUrl: './view-wrapper.component.html',
  styles: [],
  standalone: true,
  imports: [RouterOutlet],
})
export class ViewWrapperComponent {
  @Input()
  title = this.route.snapshot.data['title'];

  constructor(private route: ActivatedRoute) {}
}
