import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { BooksService } from '@service/booksService';
import { LoanService } from '@service/loanService';
import { UsersService } from '@service/usersService';
import { SearchBoxComponent } from '@shared/components/search-box/search-box.component';

@Component({
  selector: 'app-dashboard.component',
  imports: [DatePipe, NgClass, SearchBoxComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private loanService = inject(LoanService);
  private booksService = inject(BooksService);
  private usersService = inject(UsersService);
  accountInfo: any = signal({});
  dashboardSummary: any = signal({
    totalBooks: null,
    totalBooksBorrowed: null,
    totalStudents: null
  })
  pendingReturnsList: any = signal([]);

  booksDataList: any = signal([]);
  FilteredBooksDataList: any = signal([]);

  onSearchBook(term: string) {
    const obData = this.booksDataList().filter((x: any) =>
      x.title.toLowerCase().includes(term) ||
      x.author.toLowerCase().includes(term) ||
      x.isbn.toLowerCase().includes(term)
    );

    this.FilteredBooksDataList.set(obData);
  }

  ngAfterViewInit() {
    if (localStorage.getItem('role') === 'Admin') {

      this.usersService.getAllUsers().subscribe((s: any) => {
        const students = s.filter((s: any) => s.role === 'Student');
        this.dashboardSummary().totalStudents = students.length;
      })

      this.loanService.getAllLoans().subscribe((s: any) => {
        this.dashboardSummary().totalBooksBorrowed = s.filter((s: any) => s.isReturned === false).length;
      })
    }
  }

  ngOnInit() {
    this.booksService.getAll().subscribe((s: any) => {
      this.booksDataList.set(s);
      this.FilteredBooksDataList.set(s);
      this.dashboardSummary().totalBooks = s.reduce((t: number, b: any) => t + b.totalCopies, 0);
    });

    this.loanService.getMyAllLoans().subscribe((s: any) => {
      this.pendingReturnsList.set(s.filter((s: any) => s.isReturned === false));
    })

    this.usersService.getAccountInfo().subscribe((s: any) => {
      const data = {
        fullName: s.fullName,
        role: s.role,
      }
      this.accountInfo.set(data);
    })
  }

}
