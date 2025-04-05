import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class HeaderStateService {
    private title: BehaviorSubject<string> = new BehaviorSubject('');

    public getTitle() {
        return this.title;
    }

    public setTitle(title: string) {
        this.title.next(title);
    }
}