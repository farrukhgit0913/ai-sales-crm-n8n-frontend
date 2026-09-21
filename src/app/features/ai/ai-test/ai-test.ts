import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CrmService } from '../../../core/services/crm';
import { AiTestResponse } from '../../../core/models/crm.models';

@Component({
  selector: 'app-ai-test',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ai-test.html',
  styleUrl: './ai-test.scss'
})
export class AiTestComponent {
  prompt =
    'Qualify this lead: Ahmed Khan from Toyota wants a CRM solution with a $5000 budget.';

  response = '';
  model = '';
  loading = false;
  error = '';

  constructor(private crm: CrmService) {}

  runTest(): void {
    this.loading = true;
    this.response = '';
    this.error = '';

    this.crm.testAi(this.prompt).subscribe({
      next: (response: AiTestResponse) => {
        this.response = response.response;
        this.model = response.model;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        this.error =
          error instanceof Error
            ? error.message
            : 'AI test failed. Make sure Ollama is running.';
      }
    });
  }
}