import type { Univer } from "@univerjs/core";

declare global {
  interface Window {
    univerAPI?: {
      univer: Univer;
      workbook: any;
      getInjector: () => any;
      help: () => void;
    };
  }
}

export {};
