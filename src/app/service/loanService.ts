import { inject, Injectable } from '@angular/core';
import { DataService } from '@service/dataService'

@Injectable({
    providedIn: 'root',
})
export class LoanService {
    private dataService = inject(DataService);

    getAllLoans() {
        this.dataService.set("/api/Loans");
        return this.dataService.get();
    }

    getMyAllLoans() {
        this.dataService.set("/api/Loans/my-loans");
        return this.dataService.get();
    }

    issueLoan(data : any) {
        this.dataService.set("/api/Loans/issue");
        return this.dataService.post(data);
    }

    returnLoan(data: any){
        this.dataService.set(`/api/Loans/return/${data.id}`);
        return this.dataService.post();
    }
}
