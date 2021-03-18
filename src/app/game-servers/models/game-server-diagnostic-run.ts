import { DiagnosticCheck } from './diagnostic-check';

export interface GameServerDiagnosticRun {
  id: string;
  launchedAt: Date;
  gameServer: string;
  checks: DiagnosticCheck[];
  status: 'pending' | 'running' | 'completed' | 'failed';
}
