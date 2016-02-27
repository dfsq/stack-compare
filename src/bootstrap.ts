import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core'
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router'
import {HTTP_PROVIDERS} from 'angular2/http'
import {AppComponent} from './app.component';
import {TagsService} from './tags/tags.service'

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  TagsService
])
.catch(error => console.log(error))