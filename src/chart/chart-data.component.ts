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

    setTimeout(() => {
      new Highcharts.Chart({
        chart: {
          renderTo: canvas,
          type: 'column'
        },

        title: {text: `${this.data.tags[0]} vs ${this.data.tags[1]}`},

        xAxis: {
          categories: [this.data.tags[0], this.data.tags[1]]
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
          data: [this.data.total[this.data.tags[0]], this.data.total[this.data.tags[1]]],
          color: '#7CB5EC'
        }, {
          name: 'Answered',
          data: [this.data.answered[this.data.tags[0]], this.data.answered[this.data.tags[1]]],
          color: '#51AD38'
        }, {
          name: 'Unanswered',
          data: [this.data.unanswered[this.data.tags[0]], this.data.unanswered[this.data.tags[1]]],
          color: '#F78B87'
        }]
      });
    }, 100)
  }
}
