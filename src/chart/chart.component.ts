import { Component, Injector, ElementRef, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { ITag, SET_TAGS, SET_DATA } from '../reducers/tags'
import { TagsData } from '../common/tags-data.service.ts'
import { ChartData } from './chart-data.component'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/finally'

@Component({
  selector: 'chart',
  styles: [`
    :host {display: block}
    .loading + .data-container {display: none}
    h6 {text-decoration: underline; color: #818a91}
  `],
  template: `
    <pre class="loading" *ngIf="loading">Loading..</pre>
    <div class="alert alert-danger" role="alert" *ngIf="error">
      <strong>Oops!</strong> Something went wrong, could not load data.
      <div *ngIf="error.error_message"><strong>Error</strong>: {{ error.error_message }}</div>
    </div>
    <div class="row data-container" *ngIf="data">
      <div class="col-md-8">
        <chart-data [data]="data"></chart-data>
      </div>
      <div class="col-md-4">
        <div>
          <div class="m-b-1">
            <h6>Total</h6>
            <div>
              <strong>{{ tag1 }}</strong>: {{ data.total[tag1] | number }}
              <div *ngIf="data.delta[tag1] && data.delta[tag1].number">
                <strong>&#43;{{ data.delta[tag1].number }}</strong>
                <small>since {{ data.delta[tag1].prevDate | date:'medium' }}</small>
              </div>
            </div>
            <div>
              <strong>{{ tag2 }}</strong>: {{ data.total[tag2] | number }}
              <div *ngIf="data.delta[tag2] && data.delta[tag1].number">
                <strong>&#43;{{ data.delta[tag2].number }}</strong>
                <small>since {{ data.delta[tag2].prevDate | date:'medium' }}</small>
              </div>
            </div>
          </div>
          <div class="m-b-1">
            <h6>Answered</h6>
            <div><strong>{{ tag1 }}</strong>: {{ data.answered[tag1] }}</div>
            <div><strong>{{ tag2 }}</strong>: {{ data.answered[tag2] }}</div>
          </div>
          <div>
            <h6>Unanswered</h6>
            <div><strong>{{ tag1 }}</strong>: {{ data.unanswered[tag1] }}</div>
            <div><strong>{{ tag2 }}</strong>: {{ data.unanswered[tag2] }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  providers: [ Title ],
  directives: [ ChartData ]
})
export class ChartComponent implements OnInit {

  loading: boolean = true
  tag1: string
  tag2: string
  data: Object
  error: string

  constructor(
    private _tagsData: TagsData,
    private _title: Title,
    private _router: ActivatedRoute,
    private _store: Store<any>
  ) {}

  ngOnInit() {

    this._router.params
      .subscribe(params => {
        this.tag1 = params['tag1']
        this.tag2 = params['tag2']

        this._store.dispatch({
          type: SET_TAGS,
          payload: [ this.tag1, this.tag2 ]
        })
      })

    this._title.setTitle(`${this.tag1} vs ${this.tag2} | StackCompare`)

    this._store.select('data')
      .subscribe(data => {
        this.data = data
      })

    this._tagsData.loadStats(this.tag1, this.tag2)
      .finally(() => this.loading = false)
      .subscribe(
        data => this._store.dispatch({
          type: SET_DATA,
          payload: data
        }),
        response => this.error = response.json()
      )
  }
}
