import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooksService } from '@service/booksService';
import { SharedComponenet } from '@shared/infrastructure/sharedComponent';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-books-list.component',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.scss',
})
export class BooksListComponent extends SharedComponenet {
  private booksService = inject(BooksService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  selectedBook: any = signal(null);
  dataList: any = signal([]);
  bookForm: FormGroup = this.fb.group({
    id: [null],
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    isbn: ['', [Validators.required, Validators.pattern(/^\d{10}|\d{13}$/)]],
    totalCopies: [1, [Validators.required, Validators.min(1)]],
    availableCopies: [null],
    prevCopies: [null],
  });

  get isbn() { return this.bookForm.get('isbn'); }
  get title() { return this.bookForm.get('title'); }

  onAddBookClicked() {
    this.bookForm.reset();
    this.bookForm.patchValue({
      totalCopies: 1,
    })
    this.showModal('addEditBookModal').show();
  }

  onAddBook() {
    if (this.bookForm.valid) {
      this.booksService.addBook({ ...this.bookForm.value, id: 0, availableCopies: this.bookForm.get('totalCopies')?.value }).subscribe((s: any) => {
        setTimeout(() => {
          this.dataBind();
        })
        this.showModal('addEditBookModal').hide();
        this.toastr.success("Successfully Added.");
      })
    }
  }

  onUpdateBook() {
    if (this.bookForm.valid) {
      const adjustedAvailableCopies = this.bookForm.get('totalCopies')?.value - this.bookForm.get('prevCopies')?.value + this.bookForm.get('availableCopies')?.value;
      this.booksService.updateBook({ ...this.bookForm.value, availableCopies: adjustedAvailableCopies }).subscribe((s: any) => {
        this.dataBind();
        this.showModal('addEditBookModal').hide();
        this.toastr.success("Successfully Updated.");
      })
    }
  }


  onView(data: any) {
    this.selectedBook.set(null);
    this.booksService.getBookInfo(data.id).subscribe((s: any) => {
      if (s.loans && s.loans.length > 0) {

        const activeLoans = s.loans
          .filter((x: any) => !x.isReturned)
          .sort((a: any, b: any) =>
            new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
          );

        const returnedLoans = s.loans
          .filter((x: any) => x.isReturned);

        this.selectedBook.set({
          ...s,
          loans: [...activeLoans, ...returnedLoans]
        });

      } else {

        this.selectedBook.set({
          ...s,
          loans: []
        });

      }
      setTimeout(() => {
        this.showModal('viewBookModal').show();
      })
    })
  }

  onEdit(data: any) {
    this.bookForm.reset();

    this.bookForm.patchValue({
      id: data.id,
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      totalCopies: data.totalCopies,
      prevCopies: data.totalCopies,
      availableCopies: data.availableCopies
    });

    this.showModal('addEditBookModal').show();
  }

  onDelete(id: any) {
    if (!confirm('Are you sure?')) return;
    this.booksService.removeBook(id).subscribe((s: any) => {
      this.toastr.warning("Deleted Successfully");
      this.dataBind();
    })
  }

  dataBind() {
    this.booksService.getAll().subscribe((s: any) => {
      this.dataList.set(s);
    });

    this.booksService.addEditBook.subscribe((s: any) => {
      this.addUpdateDataList(this.dataList(), s, (x: any) => x.id == s.id);
    })
  }

  ngOnInit() {

    this.dataBind();
  }
}
