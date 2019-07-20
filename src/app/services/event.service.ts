import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class EventService {
    titleChangeEvent = new EventEmitter<string>();

    constructor() {}

    titleChange(name: string) {
        this.titleChangeEvent.emit(name);
    }
}