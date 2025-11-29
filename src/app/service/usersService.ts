import { inject, Injectable } from '@angular/core';
import { DataService } from '@service/dataService'
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private dataService = inject(DataService);
    addEditBook : any = new Subject();

    getAllUsers() {
        this.dataService.set("/api/Users");
        return this.dataService.get();
    }

    getAccountInfo() {
        this.dataService.set("/api/Users/me");
        return this.dataService.get();
    }
}
