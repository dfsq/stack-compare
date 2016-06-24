import { RouterConfig } from '@angular/router'
import { ChartComponent } from './chart/chart.component'
import { BlankComponent } from './blank.component'

export const appRoutes: RouterConfig = [
  { path: '', component: BlankComponent },
  { path: '/:tag1/:tag2', component: ChartComponent }
]
