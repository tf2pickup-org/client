export interface ConfigurationEntry<T = unknown> {
  key: string;
  schema: unknown;
  value?: T;
  defaultValue?: T;
}
