import { inject, Injectable } from '@angular/core';
import { DataService } from '@service/dataService'

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private dataService = inject(DataService)

    login(data:any) {
        this.dataService.set("/api/Auth/login");
        return this.dataService.post(data);
    }
    
    register(data : any){
        this.dataService.set("/api/Auth/Register");
        return this.dataService.post(data);
    }
}
