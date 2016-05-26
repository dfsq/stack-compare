import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide, enableProdMode} from '@angular/core'
import {ROUTER_PROVIDERS} from '@angular/router-deprecated'
import {LocationStrategy, HashLocationStrategy} from '@angular/common'
import {HTTP_PROVIDERS} from '@angular/http'
import {AppComponent} from './app.component';
import {TagsService} from './tags/tags.service'
import {Storage} from './common/storage'

enableProdMode()

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  TagsService,
  Storage
])
.catch(error => console.log(error))