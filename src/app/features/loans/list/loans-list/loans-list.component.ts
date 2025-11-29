import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BooksService } from '@service/booksService';
import { LoanService } from '@service/loanService';
import { UsersService } from '@service/usersService';
import { SharedComponenet } from '@shared/infrastructure/sharedComponent';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loans-list.component',
  imports: [ReactiveFormsModule, DatePipe, NgClass, NgSelectModule, FormsModule],
  templateUrl: './loans-list.component.html',
  styleUrl: './loans-list.component.scss',
})
export class LoansListComponent extends SharedComponenet {
  private loansService = inject(LoanService);
  private usersService = inject(UsersService);
  private booksService = inject(BooksService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  allUsers: any = [];
  allBooks: any = [];
  selectedPersonId: any;
  issueBookForm: FormGroup = this.fb.group({
    bookId: [null, [Validators.required]],
    memberId: [null, [Validators.required]],
    dueAt: [null, [Validators.required]]
  });

  dataList: any = signal([]);
  today = this.formatDate(new Date());

  formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  searchPerson = (term: string, item: any) => {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term);
  };

  searchBook = (term: string, item: any) => {
    term = term.toLowerCase();
    return item.title.toLowerCase().includes(term) ||
      item.author.toLowerCase().includes(term);
  };

  getInitials(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    const first = parts[0][0].toUpperCase();
    const last = parts[parts.length - 1][0].toUpperCase();

    return first + last;
  }

  markReturned(data: any) {
    if (!confirm('Do you really want to mark this book as returned?')) return;
    this.loansService.returnLoan(data).subscribe((s: any) => {
      this.dataBind();
      this.toastr.success('Book marked as returned.')
    })
  }

  getDueDate() {
    const now = new Date();
    now.setDate(now.getDate() + 14);
    return now.toISOString().substring(0, 10);
  }

  openIssueBookPopup() {
    this.issueBookForm.reset();
    this.issueBookForm.patchValue({
      dueAt: this.getDueDate()
    })
    this.showModal('issueBookModal').show();
  }

  issueBook() {
    if (this.issueBookForm.invalid) {
      this.issueBookForm.markAllAsTouched();
      return;
    }
    this.loansService.issueLoan(this.issueBookForm.value).subscribe({
      next: () => {
        this.toastr.success('Book issued successfully!');
        this.showModal('issueBookModal').hide();
        this.dataBind();
      },
      error: (err) => {
        this.toastr.error(err?.error);
      },
    });
  }

  get getPendingLoanCount() {
    return this.dataList().filter((x: any) => x.isReturned === false).length;
  }

  dataBind() {
    this.loansService.getAllLoans().subscribe((s: any) => {

      const active = s
        .filter((x: any) => x.isReturned === false)
        .sort((a: any, b: any) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

      const returned = s
        .filter((x: any) => x.isReturned === true);

      this.dataList.set([
        ...active,
        ...returned
      ]);

    });

  }

  ngOnInit() {
    this.dataBind();

    this.usersService.getAllUsers().subscribe((s: any) => {
      this.allUsers = s;
    })

    this.booksService.getAll().subscribe((s: any) => {
      this.allBooks = s;
    })
  }
}
