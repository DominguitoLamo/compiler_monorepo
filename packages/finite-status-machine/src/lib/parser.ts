import { DfaState } from "../enum/DfaState"
import { isAlpha, isBlank, isDigit } from "../utils";

export function initToken(c: string) {
  if (c.length > 1) {
    throw new Error('只可传入字符')
  }

  if (isAlpha(c)) {
    if (c === 'i') {
      return DfaState.Id_int1;
    } else {
      return DfaState.Id;
    }
  } else if (isDigit(c)) {
    return DfaState.IntLiteral;
  } else if (c === '>') {
     return DfaState.GT;
  } else if (c === '+') {
    return DfaState.Plus;
  } else if (c === '-') {
    return DfaState.Minus;
  } else if (c === '/') {
    return DfaState.Slash;
  } else if (c === '*') {
    return DfaState.Star;
  } else if (c === ';') {
    return DfaState.SemiColon;
  } else if (c === '(') {
    return DfaState.LeftParen;
  } else if (c === ')') {
    return DfaState.RightParen;
  } else if (c === '=') {
    return DfaState.Assignment;
  } else {
    return DfaState.Initial;
  }
}

export function getState(state: DfaState, ch: string) {
  if (state === DfaState.Id) {
    if (isAlpha(ch) || isDigit(ch)) {
      return DfaState.Id;
    } else {
      return DfaState.Initial;
    }
  } else if (state === DfaState.IntLiteral) {
    if (isDigit(ch)) {
      return DfaState.IntLiteral;
    } else {
      return DfaState.Initial;
    }
  } else if (state === DfaState.GT) {
    if (ch == '=') {
      return DfaState.GE;
    } else {
      return DfaState.Initial;
    }
  } else if (isOperator(state)) {
    return DfaState.Initial;
  } else if (state === DfaState.Id_int1) {
    if (ch === 'n') {
      return DfaState.Id_int2;
    } else if (isAlpha(ch) || isDigit(ch)) {
      return DfaState.Id;
    } else {
      return DfaState.Initial;
    }
  } else if (state === DfaState.Id_int2) {
    if (ch === 't') {
      return DfaState.Int;
    } else if (isAlpha(ch) || isDigit(ch)) {
      return DfaState.Id;
    } else {
      return DfaState.Initial;
    }
  } else if (state === DfaState.Int) {
    if (isBlank(ch)) {
      return DfaState.Initial;
    } else {
      return DfaState.Id;
    }
  } else {
    return DfaState.Initial;
  }
}


function isOperator(state: DfaState) {
  return state === DfaState.Plus ||
   state === DfaState.Minus ||
   state === DfaState.Star ||
   state === DfaState.Slash ||
   state === DfaState.Assignment ||
   state === DfaState.GE ||
   state === DfaState.SemiColon ||
   state === DfaState.LeftParen ||
   state === DfaState.RightParen
}