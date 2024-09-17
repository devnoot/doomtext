export class DoomText {

  private _text: string;

  constructor() {
    this._text = 'Rip and Tear. Until it is done!'
  }



  get text(): string {
    return this._text
  }

  set text(value) {
    this._text = value
  }
  

}