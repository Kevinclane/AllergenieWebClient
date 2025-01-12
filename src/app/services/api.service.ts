import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "../environments/environments.development";

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    constructor(private _http: HttpClient) {
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('An error occurred:', error.error);
        } else {
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error);
        }
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }

    public get(path: string): Observable<any> {
        return this._http.get(environment.apiUrl + path)
            .pipe(
                catchError(this.handleError)
            );
    }

    public post(path: string, body: any) {
        return this._http.post(environment.apiUrl + path, body)
            .pipe(
                catchError(this.handleError)
            )
    }

    public delete(path: string) {
        return this._http.delete(environment.apiUrl + path)
            .pipe(
                catchError(this.handleError)
            )
    }

}