export enum State {
  PENDING,
  FULFILLED,
  REJECTED,
}

type ResolveFn<T> = (value: any) => void;
type RejectFn = (reason: any) => void;
export class MPromise {
  status: State;
  value: null | any;
  constructor(executor: (resolve: ResolveFn<any>, reject: RejectFn) => void) {
    this.status = State.PENDING;
    this.value = null;
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  resolve(value) {
    if (this.status === State.PENDING) {
      this.status = State.FULFILLED;
      this.value = value;
    }
  }
  reject(reason) {
    if (this.status === State.PENDING) {
      this.status = State.REJECTED;
      this.value = reason;
    }
  }

  then(
    onFulfilled?: ((value) => void) | null,
    onRejected?: ((reason) => void) | null
  ) {
    if (typeof onFulfilled != "function") {
      onFulfilled = () => {};
    }
    if (typeof onRejected != "function") {
      onRejected = () => {};
    }
    if (this.status === State.FULFILLED) {
      try {
        onFulfilled(this.value);
      } catch (error) {
        onRejected(error);
      }
    }
    if (this.status === State.REJECTED) {
      try {
        onRejected(this.value);
      } catch (error) {
        onRejected(error);
      }
    }
  }
}

let p = new Promise((resolve, reject) => {
  resolve("hello");
});
p.then();
