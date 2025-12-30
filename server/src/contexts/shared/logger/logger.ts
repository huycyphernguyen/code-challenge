export type Attributes = any;

export interface Logger {
  info: (message: string, attributes?: Attributes) => void;
  warn: (message: string, attributes?: Attributes) => void;
}
