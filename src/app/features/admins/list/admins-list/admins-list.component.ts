import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '@service/usersService';
import { SharedComponenet } from '@shared/infrastructure/sharedComponent';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admins-list.component',
  imports: [ReactiveFormsModule],
  templateUrl: './admins-list.component.html',
  styleUrl: './admins-list.component.scss',
})
export class AdminsListComponent extends SharedComponenet {
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  dataList: any = signal([]);
  userForm: FormGroup = this.fb.group({
    id: [null],
    fullName: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    role: [null, [Validators.required]],
  });

  get fullName() { return this.userForm.get('fullName'); }
  get email() { return this.userForm.get('email'); }
  get role() { return this.userForm.get('role'); }


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

  onUpdateUser() {
    if (this.userForm.valid) {
      this.usersService.updateUser(this.userForm.value).subscribe((s: any) => {
        this.dataBind();
        this.showModal('updateUserModal').hide();
        this.toastr.success("Successfully Updated.");
      })
    }
  }

  onEdit(data: any) {
    this.userForm.reset();
    this.userForm.patchValue({
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      role: data.role
    });
    this.showModal('updateUserModal').show();
  }

  dataBind() {
    this.usersService.getAllUsers().subscribe((s: any) => {
      this.dataList.set(s.filter((x:any)=> x.role === 'Admin'));
    });
  }

  ngOnInit() {
    this.dataBind();
  }
}
