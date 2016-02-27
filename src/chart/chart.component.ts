import {Component, Injector, ElementRef} from 'angular2/core'
import {RouteParams} from 'angular2/router'
import {TagsService} from '../tags/tags.service'

var Chart = require('chart.js/Chart')

@Component({
    selector: 'chart',
    styles: ['.loading + canvas {display: none;} canvas {width: 100%; max-height: 300px;} :host {display: block;}'],
    template: `
    <pre class="loading" *ngIf="loading">Loading..</pre>
    <canvas></canvas>
    <pre>{{ data | json }}</pre>
  `
})
export class ChartComponent {

    loading: boolean = true
    tag1: string
    tag2: string
    data: any
    error: string

    constructor(private el:ElementRef, private tags:TagsService, injector:Injector) {
        var routeParams = injector.parent.get(RouteParams)
        this.tag1 = routeParams.get('tag1')
        this.tag2 = routeParams.get('tag2')
    }

    ngOnInit() {

        var canvas = this.el.nativeElement.querySelector('canvas')

        this.tags.loadStats(this.tag1, this.tag2).subscribe(
            data => {
                this.data = data
                this.loading = false
                this.renderChart(canvas)
            },
            error => this.error = error
        )
    }

    renderChart(canvas) {

        var ctx = canvas.getContext('2d')

        var data = {
            labels: [this.tag1, this.tag2],
            datasets: [{
                label: 'Total',
                fillColor: 'rgba(0, 136, 204, 0.75)',
                highlightFill: 'rgba(0, 136, 204, 0.85)',
                data: [this.data.total[this.tag1], this.data.total[this.tag2]]
            }, {
                label: 'Unanswered',
                fillColor: 'rgba(212, 210, 70, 0.75)',
                highlightFill: 'rgba(212, 210, 70, 0.85)',
                data: [this.data.unanswered[this.tag1], this.data.unanswered[this.tag2]]
            }]
        }

        new Chart(ctx).Bar(data, {
            responsive: true,
            maintainAspectRatio: true,
            barShowStroke: false,
            barValueSpacing: 20,
            multiTooltipTemplate: function (v) {
                return ` ${v.datasetLabel}: ${v.value}`
            },
            tooltipYPadding: 10,
            tooltipXPadding: 10
        })
    }

}









