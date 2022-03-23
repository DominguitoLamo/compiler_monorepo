import { DfaState } from "../enum/DfaState";

export interface SimpleToken {
  type: DfaState,
  text: string
};
