import {Injectable} from 'angular2/core'
import {Http} from 'angular2/http'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/forkJoin'


@Injectable()
export class TagsService {

    values: Array<string> = []
    apiBase = 'http://api.stackexchange.com/2.2'

    constructor(private http:Http) {
    }

    add(index, value) {
        if (this.values.indexOf(value) === -1) {
            this.values[index] = value
        }
    }

    loadStats(...tags) {
        return Observable.forkJoin(
            this.loadTotal(tags.join(';')),
            this.loadUnanswered(tags),
            (total, unanswered) => ({total, unanswered})
        )
    }

    loadTotal(tags) {
        return this.http.get(`${this.apiBase}/tags/${tags}/info?site=stackoverflow`)
            .map(response => response.json())
            .map(data => {
                return data.items.reduce(function (prev, curr) {
                    prev[curr.name] = curr.count
                    return prev
                }, {})
            })
    }

    loadUnanswered(tags) {
        return Observable.forkJoin(
            ...tags.map(tag => this.http.get(`${this.apiBase}/questions/no-answers?&tagged=${tag}&site=stackoverflow&filter=total`)),
            function (...totals) {
                return tags.reduce(function (prev, curr, i) {
                    var obj = totals[i].json()
                    prev[tags[i]] = obj.total
                    return prev
                }, {})
            }
        )
    }

    findTags(query) {
        return this.http.get(`${this.apiBase}/tags?inname=${query}&order=desc&sort=popular&site=stackoverflow`)
    }
}