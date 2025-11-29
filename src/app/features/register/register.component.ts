import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@service/authService';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register.component',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  fb = inject(FormBuilder);
  RegisterForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.RegisterForm.valid) {
      this.authService.register(this.RegisterForm.value).subscribe({
        next: (response: any) => {
          this.toastr.success("Account Created Successfully. Now you can login.");
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.toastr.warning(error.error.error);
        }
      });
    }
  }

}
