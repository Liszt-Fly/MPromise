export enum State {
  PENDING,
  FULFILLED,
  REJECTED,
}

interface callback {
  onFulfilled: (value) => void;
  onRejected: (value) => void;
}
export class MPromise {
  status: State;
  value: null | any;
  callbacks: callback[];
  /**
   * Constructs a new Promise with the given executor function.
   * @param executor A function that takes two arguments: resolve and reject.
   *                 The resolve function is called with a value when the promise is fulfilled.
   *                 The reject function is called with a reason when the promise is rejected.
   * @returns A new Promise instance.
   */
  constructor(
    executor: (
      resolve: (value: any) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    this.status = State.PENDING;
    this.value = null;
    this.callbacks = [];
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
      setTimeout(() => {
        this.callbacks.map((callback) => {
          callback.onFulfilled(value);
        });
      });
    }
  }
  reject(reason) {
    if (this.status === State.PENDING) {
      this.status = State.REJECTED;
      this.value = reason;
      setTimeout(() => {
        this.callbacks.map((callback) => {
          callback.onRejected(reason);
        });
      });
    }
  }

  then(onFulfilled?: (value) => void, onRejected?: (reason) => void) {
    if (typeof onFulfilled != "function") {
      onFulfilled = () => {};
    }
    if (typeof onRejected != "function") {
      onRejected = () => {};
    }
    if (this.status === State.FULFILLED) {
      setTimeout(() => {
        try {
          onFulfilled!(this.value);
        } catch (error) {
          onRejected!(error);
        }
      });
    }
    if (this.status === State.PENDING) {
      this.callbacks.push({
        onFulfilled: (value) => {
          try {
            onFulfilled!(value);
          } catch (error) {
            onRejected!(error);
          }
        },
        onRejected: (reason) => {
          try {
            onRejected!(reason);
          } catch (error) {
            onRejected!(reason);
          }
        },
      });
    }
    if (this.status === State.REJECTED) {
      setTimeout(() => {
        try {
          onRejected!(this.value);
        } catch (error) {
          onRejected!(error);
        }
      });
    }
  }
}
