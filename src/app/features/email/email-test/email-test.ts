import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CrmService } from '../../../core/services/crm';

interface EmailTestResponse {
  success: boolean;
  message?: string;
  error?: string;
}

@Component({
  selector: 'app-email-test',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './email-test.html',
  styleUrl: './email-test.scss'
})
export class EmailTestComponent {
  to = 'test@example.com';
  subject = 'AI Sales CRM Test Email';
  text = 'This is a test email from the AI Sales CRM.';

  sending = false;
  success = '';
  error = '';

  constructor(private crm: CrmService) {}

  sendEmail(): void {
    this.sending = true;
    this.success = '';
    this.error = '';

    this.crm.testEmail({
      to: this.to,
      subject: this.subject,
      text: this.text
    }).subscribe({
      next: (response: EmailTestResponse) => {
        this.sending = false;

        if (response.success) {
          this.success = response.message || 'Email sent successfully.';
        } else {
          this.error = response.error || 'Email test failed.';
        }
      },
      error: (error: unknown) => {
        this.sending = false;

        this.error =
          error instanceof Error
            ? error.message
            : 'Email test failed. Make sure Mailpit is running.';
      }
    });
  }
}