import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";

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

  onSubmit(): void {
    if (
      !this.name ||
      !this.email ||
      !this.password ||
      this.password !== this.confirmPassword
    ) {
      return;
    }

    // Connect your registration API here.
    console.log("Sign up submitted", {
      name: this.name,
      email: this.email,
    });
  }
}