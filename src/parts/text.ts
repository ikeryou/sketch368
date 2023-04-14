import { MyDisplay } from "../core/myDisplay";
import { Func } from "../core/func";
import { Tween } from "../core/tween";
import { TextItem } from "./textItem";
import { Util } from "../libs/util";
import { Val } from "../libs/val";
import { Point } from "../libs/point";

// -----------------------------------------
//
// -----------------------------------------
export class Text extends MyDisplay {

  private _parentTxt: HTMLElement;
  private _blocksEl: HTMLElement;

  private _line: number = 6;
  private _items: Array<TextItem> = [];

  private _cutRate: Val = new Val();

  private _ang: number = 45;

  private _myPos: Point = new Point();

  constructor(opt:any) {
    super(opt)

    this._parentTxt = this.qs('.js-text-org') as HTMLElement;
    this._blocksEl = this.qs('.js-text-blocks') as HTMLElement;

    const num = this._line * this._line;
    for(let i = 0; i < num; i++) {
      const b = document.createElement('div');
      b.classList.add('js-text-item');
      this._blocksEl.append(b);
      b.append(this._parentTxt.cloneNode(true));

      const item = new TextItem({
        el: b,
        key: i,
        ang: this._ang
      });
      this._items.push(item);
    }
    Util.shuffle(this._items);


  }




  private _updateItemSize(): void {
    const sw = Func.sw();
    const sh = Func.sh();

    const fontSize = Math.min(sw, sh) * Func.val(0.9, 0.75);
    const h = 1;
    Tween.set(this._parentTxt, {
      // fontSize:  fontSize,
      width: fontSize,
      height: fontSize * h,
    });

    const txtSize = this.getRect(this._parentTxt);

    const txtWidth = txtSize.width * 1;
    const txtHeight = txtSize.height * 1;

    const blockWidth = (txtWidth / this._line) * 1;
    const blockHeight = (txtHeight / this._line) * 1;

    if(this._c % 20 == 0) {
      const rect = this.getOffset(this.el)
      this._myPos.x = rect.x;
      this._myPos.y = rect.y;
    }

    Tween.set(this._parentTxt, {
      x: 0,
      y: 0,
    })

    this._items.forEach((val,i) => {
      const ix = ~~(i / this._line);
      const iy = ~~(i % this._line);

      const x = ix * blockWidth;
      const y = iy * blockHeight;

      Tween.set(val.el, {
        width: blockWidth,
        height: blockHeight,
        left: x,
        top: y,
      })

      Tween.set(val.inner, {
        width: fontSize,
        height: fontSize * h,
      })

      val.center.x = this._myPos.x + blockWidth * 0.5;
      val.center.y = this._myPos.y + blockHeight * 0.5;

      val.pos.width = blockWidth;
      val.pos.x = x + blockWidth * 0.5;
      val.pos.y = y + blockHeight * 0.5;

      val.innerPos.x = -ix * blockWidth;
      val.innerPos.y = -iy * blockHeight;
    })
  }

  protected _update(): void {
    super._update();

    if(this._c % 30 == 0) {
      this._updateItemSize();
    }

    const input = this._parentTxt.querySelector('input') as HTMLInputElement;

    this._cutRate.val = Util.map(Number(input.value), 0, 1, 0, 100) *1;

    const range = Math.max(Func.sh(), Func.sw()) * 0.05;

    this._items.forEach((val) => {
      val.setInputValue(input.value);

      Tween.set(val.el, {
        x: this._cutRate.val * range * val.noise.x,
        y: this._cutRate.val * range * val.noise.y,
      })

      // if(this._noise < 0.5) {
      //   Tween.set(val.el, {
      //     x: (this._cutRate.val * Math.max(Func.sh(), Func.sw()) * range * this._noise2) * (iy >= this._line * 0.5 ? 1 : -1),
      //     y: 0,
      //   })
      // } else {
      //   Tween.set(val.el, {
      //     y: (this._cutRate.val * Math.max(Func.sh(), Func.sw()) * range * this._noise2) * (ix >= this._line * 0.5 ? 1 : -1),
      //     x: 0,
      //   })
      // }
    })

    Tween.set(this.el, {
      rotateZ: this._ang,
    })
    Tween.set(this._parentTxt, {
      rotateZ: -this._ang,
    })
  }
}