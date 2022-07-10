import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { HistoricoComponent } from './historico/historico.component';
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
  {
    path: 'historico',
    component: HistoricoComponent,
  },

  {
    path: 'config',
    component: ConfigComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
