import { NgModule } from '@angular/core';
import { TodoJourneyComponent } from './todo-journey.component';
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [TodoJourneyComponent],
  imports: [
    RouterModule.forChild([
      {path:'', component: TodoJourneyComponent}
    ])
  ],
  exports: [TodoJourneyComponent]
})
export class TodoJourneyModule { }
