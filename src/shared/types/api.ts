export interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}
