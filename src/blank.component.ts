import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { UNSET_TAGS } from './reducers/tags'

@Component({
  template: `
    <p class="m-t-2 text-xs-center text-muted">Select tags to compare and see the magic!</p>
  `
})
export class BlankComponent {
  constructor(private _store: Store<any>) {
    this._store.dispatch({
      type: UNSET_TAGS
    })
  }
}
