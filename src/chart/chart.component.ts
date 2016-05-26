import {Component, Injector, ElementRef} from '@angular/core'
import {Title} from '@angular/platform-browser'
import {RouteParams, Router} from '@angular/router-deprecated'
import {TagsService} from '../tags/tags.service'
import {Storage} from '../common/storage'

var Highcharts = require('highcharts')

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
    <div class="row data-container">
      <div class="col-md-8">
        <div class="canvas"></div>
      </div>
      <div class="col-md-4">
        <div *ngIf="data">
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
  providers: [Title]
})
export class ChartComponent {

  loading:boolean = true
  tag1:string
  tag2:string
  data:any
  error:string

  constructor(private el: ElementRef, private tags: TagsService, private title: Title, private storage: Storage, private router: Router) {
    var instruction = router.root.currentInstruction
    var routeParams = instruction.component.params
    this.tag1 = routeParams['tag1']
    this.tag2 = routeParams['tag2']
  }

  ngOnInit() {

    this.title.setTitle(`${this.tag1} vs ${this.tag2} | StackCompare`)

    var canvas = this.el.nativeElement.querySelector('.canvas')

    this.tags.loadStats(this.tag1, this.tag2).subscribe(
      data => {
        this.data = data
        this.loading = false
        this.renderChart(canvas)
      },
      response => {
        this.error = response.json()
        this.loading = false
      }
    )
  }

  renderChart(canvas) {

    setTimeout(() => {
      new Highcharts.Chart({
        chart: {
          renderTo: canvas,
          type: 'column'
        },

        title: {text: `${this.tag1} vs ${this.tag2}`},

        xAxis: {
          categories: [this.tag1, this.tag2]
        },

        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'Number of questions'
          }
        },

        /**
         * @property x
         * @property y
         * @property series.name
         */
        tooltip: {
          formatter: function () {
            return `<b>${this.x}</b><br>${this.series.name}: ${this.y}`
          }
        },

        series: [{
          name: 'Total',
          data: [this.data.total[this.tag1], this.data.total[this.tag2]],
          color: '#7CB5EC'
        }, {
          name: 'Answered',
          data: [this.data.answered[this.tag1], this.data.answered[this.tag2]],
          color: '#51AD38'
        }, {
          name: 'Unanswered',
          data: [this.data.unanswered[this.tag1], this.data.unanswered[this.tag2]],
          color: '#F78B87'
        }]
      });
    }, 100)

  }

}
