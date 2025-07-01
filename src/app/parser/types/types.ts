export type Instruction = {
  type: InstructionType;
  offset: number;
  label: string;
  bytesLength: number;
  color: string;
};

export enum InstructionType {
  STRING = "STRING",
  DECIMAL = "DECIMAL",
  RAW = "RAW",
}
