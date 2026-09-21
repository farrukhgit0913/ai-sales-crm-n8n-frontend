import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";

import {
  CrmService,
  AiTestResponse,
} from "../../../core/services/crm";

@Component({
  selector: "app-ai-test",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./ai-test.html",
  styleUrl: "./ai-test.scss",
})
export class AiTestComponent {
  readonly prompt = signal("");
  readonly response = signal("");
  readonly model = signal("");
  readonly loading = signal(false);
  readonly error = signal("");

  readonly examplePrompts = [
    "Give me one short sales qualification question.",
    "Write a short professional follow-up message for a new sales lead.",
    "Suggest the next sales action for a qualified lead.",
    "Give me 3 questions a salesperson should ask a potential customer.",
  ];

  constructor(
    private readonly crm: CrmService,
  ) {}

  setPrompt(prompt: string): void {
    this.prompt.set(prompt);
    this.error.set("");
  }

  onPromptInput(event: Event): void {
    const textarea =
      event.target as HTMLTextAreaElement;

    this.prompt.set(textarea.value);
    this.error.set("");
  }

  askAi(): void {
    const prompt = this.prompt().trim();

    if (!prompt) {
      this.error.set(
        "Please enter a prompt first.",
      );
      return;
    }

    this.loading.set(true);
    this.error.set("");
    this.response.set("");
    this.model.set("");

    this.crm.testAi(prompt).subscribe({
      next: (result: AiTestResponse) => {
        this.response.set(
          result.response || "No response returned.",
        );

        this.model.set(result.model || "");

        this.loading.set(false);
      },

      error: (error: HttpErrorResponse) => {
        console.error(
          "AI test error:",
          error,
        );

        this.error.set(
          error?.error?.error ||
            "Unable to connect to the AI service.",
        );

        this.loading.set(false);
      },
    });
  }

  clear(): void {
    this.prompt.set("");
    this.response.set("");
    this.model.set("");
    this.error.set("");
  }
}