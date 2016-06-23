import {Component} from '@angular/core'
import {Location} from '@angular/common'
import {RouteConfig, Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated'
import { Store } from '@ngrx/store'
import { Observable } from "rxjs/Observable"
import 'rxjs/add/operator/filter'
import { ITag, SET_TAGS } from './reducers/tags'
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
        <h1 class="h2">
          <code class="bg-inverse m-b-3">
            <a [routerLink]="['Blank']"><strong>// StackCompare</strong></a>
            <a class="icon-github" href="https://github.com/dfsq/stack-compare" title="GitHub: open issue, view code" target="_blank">
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414"><path d="M8 0C3.58 0 0 3.582 0 8c0 3.535 2.292 6.533 5.47 7.59.4.075.547-.172.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.223 1.873.87 2.33.665.072-.517.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.31-1.587.823-2.147-.083-.202-.358-1.015.077-2.117 0 0 .672-.215 2.2.82.638-.178 1.323-.266 2.003-.27.68.004 1.364.092 2.003.27 1.527-1.035 2.198-.82 2.198-.82.437 1.102.163 1.915.08 2.117.513.56.823 1.274.823 2.147 0 3.073-1.87 3.75-3.653 3.947.287.246.543.735.543 1.48 0 1.07-.01 1.933-.01 2.195 0 .215.144.463.55.385C13.71 14.53 16 11.534 16 8c0-4.418-3.582-8-8-8"></path></svg>
            </a>
          </code>
        </h1>
      </header>
      <div class="row row-tags m-b-2">
        <div class="col-xs-12 col-sm-5">
          <tag-select (onSelect)="select(0, $event.value)" [value]="tags[0]?.name || ''" placeholder="Tag #1"></tag-select>
        </div>
        <div class="col-xs-12 col-sm-2 text-xs-center">
          <label>VS</label>
        </div>
        <div class="col-xs-12 col-sm-5">
          <tag-select (onSelect)="select(1, $event.value)" [value]="tags[1]?.name || ''" placeholder="Tag #2"></tag-select>
        </div>
      </div>
      <div class="text-xs-center m-b-2">
        <button [disabled]="tags?.length < 2" (click)="redirect()"
                class="btn btn-secondary btn-lg btn-xs-block">Compare!
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

  tags: Array<ITag> = []

  constructor(
    private _tagsService: TagsService,
    private _router: Router,
    private _location: Location,
    private _store: Store<any>
  ) {

    _store.select<ITag[]>('tags')
      .filter(tags => tags.length === 2)
      .subscribe(tags => this.tags = tags)
  }

  redirect() {
    this._router.navigate(['./Chart', {
      tag1: this.tags[0].name,
      tag2: this.tags[1].name
    }])
  }

  select(index, name) {
    this._store.dispatch({
      type: 'ADD_TAG',
      payload: {
        index,
        name
      }
    })
  }
}
