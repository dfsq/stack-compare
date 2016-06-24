import { Component, OnInit, ElementRef, Input } from '@angular/core'
import { ITagsData } from '../reducers/tags';

const Highcharts = require('highcharts')

@Component({
  selector: 'chart-data',
  template: `
    <div class="canvas"></div>
  `
})
export class ChartData implements OnInit {

  @Input() data: ITagsData

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const canvas = this.el.nativeElement.querySelector('.canvas')
    this.renderChart(canvas)
  }

  renderChart(canvas) {

    const tag1 = this.data.tags[0]
    const tag2 = this.data.tags[1]

    setTimeout(() => {
      new Highcharts.Chart({
        chart: {
          renderTo: canvas,
          type: 'column'
        },

        title: { text: `${tag1} vs ${tag2}` },

        xAxis: {
          categories: [ tag1, tag2 ]
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
          data: [ this.data.total[tag1], this.data.total[tag2] ],
          color: '#7CB5EC'
        }, {
          name: 'Answered',
          data: [ this.data.answered[tag1], this.data.answered[tag2] ],
          color: '#51AD38'
        }, {
          name: 'Unanswered',
          data: [ this.data.unanswered[tag1], this.data.unanswered[tag2] ],
          color: '#F78B87'
        }]
      })
    }, 100)
  }
}
