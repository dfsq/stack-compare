import { NgModule, provide, enableProdMode } from '@angular/core'
import { LocationStrategy, HashLocationStrategy } from '@angular/common'

import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http'

import { provideStore } from '@ngrx/store'
import { tags, data } from './reducers/tags'

import { AppComponent } from './app.component'
import { AppRoutes } from './app.routes'

import { TagsData } from './common/tags-data.service.ts'
import { Storage } from './common/storage'

import { TagSelect } from './tags/tag-select.component'

enableProdMode()

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutes,
  ],
  declarations: [
    AppComponent,
    TagSelect
  ],
  bootstrap: [ AppComponent ],
  providers: [
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    provideStore({ tags, data }),
    TagsData,
    Storage
  ]
})
export class AppModule {}
