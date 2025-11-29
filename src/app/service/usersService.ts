import { inject, Injectable } from '@angular/core';
import { DataService } from '@service/dataService'
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private dataService = inject(DataService);

    getAllUsers() {
        this.dataService.set("/api/Users");
        return this.dataService.get();
    }

    updateUser(data: any) {
        this.dataService.set(`/api/Users/${data.id}`);
        return this.dataService.put(data);
    }

    getAccountInfo() {
        this.dataService.set("/api/Users/me");
        return this.dataService.get();
    }
}
