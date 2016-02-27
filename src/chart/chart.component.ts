import {Component, Injector, ElementRef} from 'angular2/core'
import {RouteParams} from 'angular2/router'
import {TagsService} from '../tags/tags.service'

var Highcharts = require('highcharts');

@Component({
  selector: 'chart',
  styles: [`
    :host {display: block}
    .loading + .data-container {display: none}
    h6 {text-decoration: underline}
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
            <div><strong>{{ tag1 }}</strong>: {{ data.total[tag1] }}</div>
            <div><strong>{{ tag2 }}</strong>: {{ data.total[tag2] }}</div>
          </div>
          <div>
            <h6>Unanswered</h6>
            <div><strong>{{ tag1 }}</strong>: {{ data.unanswered[tag1] }}</div>
            <div><strong>{{ tag2 }}</strong>: {{ data.unanswered[tag2] }}</div>
          </div>
          <pre>{{ data | json }}</pre>
        </div>
      </div>
    </div>
  `
})
export class ChartComponent {

  loading:boolean = true
  tag1:string
  tag2:string
  data:any
  error:string

  constructor(private el:ElementRef, private tags:TagsService, injector:Injector) {
    var routeParams = injector.parent.get(RouteParams)
    this.tag1 = routeParams.get('tag1')
    this.tag2 = routeParams.get('tag2')
  }

  ngOnInit() {

    // Better way to set title?
    document.title = `${this.tag1} vs ${this.tag2} | StackCompare`

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
        exporting: true,

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
          name: 'Unanswered',
          data: [this.data.unanswered[this.tag1], this.data.unanswered[this.tag2]],
          color: '#f36e65'
        }]
      });
    }, 100)

  }

}









