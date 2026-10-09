
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { finalize } from "rxjs";

interface SigninResponse {
  message?: string;
  token?: string;
  accessToken?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
}

@Component({
  selector: "app-signin",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: "./signin.html",
  styleUrl: "./signin.scss",
})
export class SigninComponent {
  email = "";
  password = "";
  showPassword = false;
  isLoading = false;
  errorMessage = "";
  successMessage = "";

  private readonly apiUrl = "http://localhost:3000/api/auth/login";

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = "";
    this.successMessage = "";

    const email = this.email.trim();

    if (!email || !this.password) {
      this.errorMessage = "Please enter your email and password.";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      this.errorMessage = "Please enter a valid email address.";
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.http
      .post<SigninResponse>(this.apiUrl, {
        email,
        password: this.password,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.successMessage =
            response.message || "Sign in successful.";

          // Store a token only if your backend returns one.
          // For cookie-based authentication, configure the
          // backend and HttpClient to use secure credentials.
          const token = response.accessToken || response.token;
          const user = response.user;

          if (token) {
            sessionStorage.setItem("auth_token", token);
            sessionStorage.setItem("auth_user", JSON.stringify(user));
          }

          // Adjust this route to your actual dashboard route.
          void this.router.navigate(["/dashboard"]);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.errorMessage =
              "Cannot connect to the server. Please try again.";
          } else if (error.status === 401 || error.status === 400) {
            this.errorMessage =
              error.error?.message ||
              "Invalid email or password.";
          } else {
            this.errorMessage =
              error.error?.message ||
              "Sign in failed. Please try again.";
          }
        },
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}