export type Instruction = {
  type: string;
  label: string;
  bytesLength: number;
  holdValue: number;
  color: string;
};

export enum InstructionType {
  STRING = "STRING",
  DECIMAL = "DECIMAL",
}
