import { Action, ActionReducer } from '@ngrx/store'

export const ADD_TAG = 'ADD_TAG'
export const SET_TAGS = 'SET_TAGS'
export const SET_DATA = 'SET_DATA'
export const UNSET_TAGS = 'UNSET_TAGS'

export interface ITag {
  name?: String
  data?: Object
}

export interface ITagsData {
  total: Object
  answered: Object
  unanswered: Object
  delta: Object
  tags: Array<string>
}

const initialState = []

export const tags: ActionReducer<Array<ITag>> = function(
  state: Array<ITag> = initialState,
  action: Action
) {
  switch (action.type) {
    case ADD_TAG:
      var newState = state.map(item => Object.assign({}, item))
      newState[action.payload.index] = { name: action.payload.name }
      return newState

    case SET_TAGS:
      return action.payload.map(tag => ({ name: tag }))

    case UNSET_TAGS:
      return initialState

    default:
      return state
  }
}

export const data: ActionReducer<Object> = function(
  state: Object = {},
  action: Action
) {
  if (action.type === SET_DATA) {
    return action.payload
  }
}
