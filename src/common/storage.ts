import { Injectable } from '@angular/core'

const STORAGE_ROOT = 'stackcompare'

@Injectable()
export class Storage {

  get(key) {
    return this._getStorage()[key] || null
  }

  set(key, value) {
    var storage = this._getStorage()
    storage[key] = value
    this._saveStorage(storage)
    return value
  }

  remove(key) {
    var storage = this._getStorage()
    delete storage[key]
    this._saveStorage(storage)
  }

  _getStorage() {
    return JSON.parse(window.localStorage[STORAGE_ROOT] || '{}') || {}
  }

  _saveStorage(value) {
    window.localStorage.setItem(STORAGE_ROOT, JSON.stringify(value))
  }
}
