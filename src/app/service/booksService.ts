import { inject, Injectable } from '@angular/core';
import { DataService } from '@service/dataService'
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BooksService {
    private dataService = inject(DataService);
    addEditBook : any = new Subject();

    getAll() {
        this.dataService.set("/api/Books");
        return this.dataService.get();
    }

    getBookInfo(id : any){
        this.dataService.set(`/api/Books/${id}/loans`);
        return this.dataService.get();
    }

    addBook(data : any){
        this.dataService.set("/api/Books");
        return this.dataService.post(data);
    }

    updateBook(data : any){
        this.dataService.set(`/api/Books/${data.id}`);
        return this.dataService.put(data);
    }

    removeBook(id : any){
        this.dataService.set(`/api/Books/${id}`);
        return this.dataService.delete();
    }
}
