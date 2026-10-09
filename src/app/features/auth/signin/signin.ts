import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";

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

  onSubmit(): void {
    if (!this.email || !this.password) {
      return;
    }

    // Connect your authentication API here.
    console.log("Sign in submitted", this.email);
  }
}