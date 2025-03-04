import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  templateUrl: './view-wrapper.component.html',
  styles: [],
  standalone: true,
  imports: [RouterModule],
})
export class ViewWrapperComponent {
  @Input()
  title = this.route.snapshot.data['title'];

  constructor(private route: ActivatedRoute) {}
}
