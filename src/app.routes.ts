import { Routes, RouterModule } from '@angular/router'
import { ChartComponent } from './chart/chart.component'
import { BlankComponent } from './blank.component'

const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: ':tag1/:tag2', component: ChartComponent }
]

export const AppRoutes = RouterModule.forRoot(routes)
