import {Component} from 'angular2/core'
import {RouteConfig, Router, Location, ROUTER_DIRECTIVES} from 'angular2/router'
import {TagsService} from './tags/tags.service'
import {TagSelect} from './tags/tag-select.component'
import {BlankComponent} from './blank.component'
import {ChartComponent} from './chart/chart.component'

import './styles/app.scss'

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <header>
        <h1 class="h4">
          <code class="bg-inverse m-b-3"><strong>// StackCompare</strong></code>
        </h1>
      </header>
      <div class="row row-tags m-b-1">
        <div class="col-xs-12 col-sm-5">
          <tag-select (onSelect)="select(0, $event.value)" [value]="tags.values[0] || ''" placeholder="Tag #1"></tag-select>
        </div>
        <div class="col-xs-12 col-sm-2 text-xs-center">
          <label>VS</label>
        </div>
        <div class="col-xs-12 col-sm-5">
          <tag-select (onSelect)="select(1, $event.value)" [value]="tags.values[1] || ''" placeholder="Tag #2"></tag-select>
        </div>
      </div>
      <div class="text-xs-center m-b-2">
        <button [disabled]="tags.values.length < 2" (click)="redirect()"
                class="btn btn-secondary btn-lg btn-xs-block">Let's go!
        </button>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  directives: [TagSelect, ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: '/', name: 'Blank', component: BlankComponent},
  {path: '/:tag1/:tag2', name: 'Chart', component: ChartComponent}
])
export class AppComponent {

  constructor(private tags:TagsService, private router:Router, location:Location) {
    var path = location.path()
    if (path) {
      tags.values = path.split('/').slice(1)
    }
    else {
      // tags.values = ['angular2', 'aurelia']
    }
  }

  redirect() {
    this.router.navigate(['./Chart', {tag1: this.tags.values[0], tag2: this.tags.values[1]}])
  }

  select(index, value) {
    this.tags.add(index, value)
  }
}