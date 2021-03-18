export interface DiagnosticCheck {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  reportedWarnings: string[];
  reportedErrors: string[];
  critical: boolean;
}
