import { bootstrap } from '@angular/platform-browser-dynamic'
import { provideRouter } from '@angular/router'
import { provide, enableProdMode } from '@angular/core'
import { LocationStrategy, HashLocationStrategy } from '@angular/common'
import { HTTP_PROVIDERS } from '@angular/http'

import { provideStore } from '@ngrx/store'
import { tags, data } from './reducers/tags'

import { AppComponent } from './app.component'
import { TagsData } from './common/tags-data.service.ts'
import { Storage } from './common/storage'

import { appRoutes } from './app.routes'

enableProdMode()

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  provideRouter(appRoutes),
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  provideStore({ tags, data }),
  TagsData,
  Storage
])
.catch(error => console.log(error))
