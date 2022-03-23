import { DfaState } from "../enum/DfaState";
import { SimpleToken } from "../interfaces/SimpleToken";
import { isBlank } from "../utils";

import { getState, initToken } from "./parser";

class SimpleLexer {

  private token: SimpleToken = null;

  private tokens: Array<SimpleToken> = [];

  tokenize(code: string) {
    let cIndex = 0;
    let char = null;

    this.token = {
      text: '',
      type: DfaState.Initial
    }

    while (cIndex < code.length) {
      char = code.charAt(cIndex);

      // 初始化狀態
      if (this.token.type === DfaState.Initial) {
        if (isBlank(char)) {
          this.initCurrentToken();
          cIndex++;
          continue;
        }
        this.token.text = this.token.text.concat(char);
        const state = initToken(this.token.text);
        this.token.type = state;
        cIndex++;
        continue;
      }

      const state = getState(this.token.type, char);
      if (state !== DfaState.Initial) {
        this.token.type = state
        this.token.text = this.token.text.concat(char);
        cIndex++;
      } else {
        this.addToken()
      }
    }

    if (this.token && this.token.type !== DfaState.Initial) {
      this.addToken()
    }

    return new SimpleTokenReader(this.tokens);
  }

  private addToken() {
    if (this.token.text.length > 0) {
      this.tokens.push({
        ...this.token
      })
      this.initCurrentToken();
    }
  }

  private initCurrentToken() {
    this.token = {
      text: '',
      type: DfaState.Initial
    };
  }
}

export class SimpleTokenReader {

  tokens:ReadonlyArray<SimpleToken>;

  private pos: number;

  constructor(tokens: Array<SimpleToken>) {
    this.tokens = tokens;
    this.pos = 0;
  }

  read() {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos++];
    }
    return null;
  }

  peek() {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos];
    }
    return null;
  }

  unread() {
    if (this.pos > 0) {
      this.pos--;
    }
  }

  getPosition() {
    return this.pos;
  }

  setPos(pos: number) {
    if (pos >= 0 && pos < this.tokens.length) {
      this.pos = pos;
    }
  }
}

export function tokenize(code: string) {
  return new SimpleLexer().tokenize(code);
}

export function dumpTokenReader (tokenReader: SimpleTokenReader) {
  console.log('text\ttype');
  let token: SimpleToken = null;
  while ((token = tokenReader.read()) != null) {
     console.log(`${token.text}\t${token.type}`);
  } 
}