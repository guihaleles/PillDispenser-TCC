import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SchedulerComponent } from './scheduler/scheduler.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'scheduler',
    pathMatch: 'full',
  },
  {
    path: 'scheduler',
    component: SchedulerComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
