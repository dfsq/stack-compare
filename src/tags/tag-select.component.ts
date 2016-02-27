import {Component, ElementRef, Input, Output, EventEmitter} from 'angular2/core'
import {TagsService} from './tags.service'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/switchMap'
import {Response} from "angular2/http";

@Component({
    selector: 'tag-select',
    template: `
    <input type="text" class="input form-control form-control-lg"
      [value]="value"
      [placeholder]="placeholder">
    <div class="list-group dropdown-list">
      <button type="button" class="list-group-item"
        (click)="select(item.name)"
        *ngFor="#item of items">{{ item.name }}</button>
    </div>
  `,
    styleUrls: ['./tags/tags-select.component.css']
})
export class TagSelect {

    @Input() value
    @Input() placeholder
    @Output() onSelect = new EventEmitter()

    items: Array<any>

    constructor(private el:ElementRef, private tags:TagsService) {}

    ngOnInit() {
        var inputEl: HTMLInputElement = this.el.nativeElement.querySelector('.input')
        Observable.fromEvent(inputEl, 'input')
            .debounceTime(400)
            .switchMap(event => this.tags.findTags(inputEl.value))
            .map(res=> (<Response>res).json())
            .subscribe(response => this.items = response.items)
    }

    select(value) {
        this.value = value
        this.items = null
        this.onSelect.emit({value: value})
    }

}