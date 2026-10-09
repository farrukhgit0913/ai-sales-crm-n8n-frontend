import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: "./signup.html",
  styleUrl: "./signup.scss",
})
export class SignupComponent {
  name = "";
  email = "";
  password = "";
  confirmPassword = "";

  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;

  errorMessage = "";
  successMessage = "";

  // Replace with your backend registration endpoint.
  private readonly apiUrl = "http://localhost:3000/api/auth/register";

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = "";
    this.successMessage = "";

    const name = this.name.trim();
    const email = this.email.trim().toLowerCase();

    if (!name || !email || !this.password || !this.confirmPassword) {
      this.errorMessage = "Please fill in all fields.";
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match.";
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = "Password must be at least 8 characters.";
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.http
      .post<{ message?: string }>(this.apiUrl, {
        name,
        email,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage =
            response.message || "Your account has been created successfully.";

          this.name = "";
          this.email = "";
          this.password = "";
          this.confirmPassword = "";

          // Redirect to sign in after successful registration.
          this.router.navigate(["/signin"]);
        },
        error: (error) => {
          this.isSubmitting = false;

          this.errorMessage =
            error.error?.message ||
            "Unable to create your account. Please try again.";
        },
      });
  }
}