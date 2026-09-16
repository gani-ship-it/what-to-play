export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'error';
  app_name: string;
  version: string;
  database: string;
  database_url_masked: string;
  timestamp: string;
}

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface FoundationFeature {
  title: string;
  description: string;
  status: 'ready' | 'in_progress' | 'planned';
  phase: number;
}
