export const TIPI_OPERAZIONE = [
  'potatura',
  'trattamento',
  'diserbo',
  'concimazione',
  'vendemmia',
  'irrigazione',
  'legatura',
  'altro',
] as const;

export type TipoOperazione = typeof TIPI_OPERAZIONE[number];
