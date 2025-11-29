import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-search-box',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {
    searchTerm: string = '';
    @Input() placeholder: string = 'Search...';
    @Output() search = new EventEmitter<string>();

    onSearchChange() {
        this.search.emit(this.searchTerm.trim());
    }

    clear() {
        this.searchTerm = '';
        this.search.emit('');
    }
}
