import * as moment from 'moment';

export class TempObjectMap<K, V> extends Map<K, V> {
  private _expTimeMap = new Map<K, number>();

  constructor(
    private _label,
    private _storeTimeSeconds: number,
    private _checkTimeSeconds: number,
  ) {
    super();

    setInterval(() => {
      this.cleanUp();
    }, this._checkTimeSeconds * 1000);
  }

  private cleanUp() {
    console.log(`${moment().format()} "${this._label}" clean up...`);
    console.log(`${this._label} size before: ${this.size}`);

    this._expTimeMap.forEach((value, key) => {
      if (moment().unix() > value) {
        this.delete(key);
        this._expTimeMap.delete(key);
      }
    });

    console.log(`${this._label} size after: ${this.size}`);
    console.log(`${moment().format()} "${this._label}" clean up done`);
  }

  get(key: K): V | undefined {
    this._expTimeMap.set(
      key,
      moment().add(this._storeTimeSeconds, 'seconds').unix(),
    );

    const value = super.get(key);
    return value;
  }

  set(key: K, value: V) {
    this._expTimeMap.set(
      key,
      moment().add(this._storeTimeSeconds, 'seconds').unix(),
    );

    return super.set(key, value);
  }
}
