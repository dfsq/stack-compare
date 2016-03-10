import {Injectable} from 'angular2/core'

@Injectable()
export class Storage {

  get(key) {
    window['storage'] = this
    return JSON.parse(window.localStorage.getItem(key))
  }

  set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
    return value
  }
}