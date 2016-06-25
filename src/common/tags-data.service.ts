import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/forkJoin'
import { Storage } from '../common/storage'

@Injectable()
export class TagsData {

  values: Array<string> = []
  apiBase = '//api.stackexchange.com/2.2'
  //apiBase = '/data.json?'

  constructor(private _http: Http, private _storage: Storage) {}

  add(index, value) {
    if (this.values.indexOf(value) === -1) {
      this.values[index] = value
    }
  }

  loadStats(...tags) {

    return Observable.forkJoin(
      this.loadTotal(tags.join(';')),
      this.loadUnanswered(tags),
      (total, unanswered) => {

        var keys = Object.keys(total)

        var answered = keys.reduce((prev, key) => {
          prev[key] = total[key] - unanswered[key]
          return prev
        }, {})

        var delta = keys.reduce((prev, key) => {
          var cached = this._storage.get(key)
          prev[key] = cached && cached.total ? total[key] - cached.total : undefined
          if (cached && cached.total) {
            prev[key] = {
              number: total[key] - cached.total,
              prevDate: cached.date
            }
          }
          this._storage.set(key, {total: total[key], date: Date.now()})
          return prev
        }, {})

        return {
          total,
          answered,
          unanswered,
          delta,
          tags
        }
      }
    )
  }

  loadTotal(tags) {
    return this._http.get(`${this.apiBase}/tags/${tags}/info?site=stackoverflow`)
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
      ...tags.map(tag => this._http.get(`${this.apiBase}/questions/no-answers?&tagged=${tag}&site=stackoverflow&filter=total`)),
      function (...totals) {
        return tags.reduce(function(prev, curr, i) {
          var obj = totals[i].json()
          prev[tags[i]] = obj.total
          return prev
        }, {})
      }
    )
  }

  findTags(query) {
    return this._http.get(`${this.apiBase}/tags?inname=${query}&order=desc&sort=popular&site=stackoverflow`)
  }
}
