import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Utils {
    public static formatPhoneNumber(phoneNumber: string): string {
        return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
}