export class Vector {
    #buffer: Float32Array;
    #length: number;
    #capacity: number;

    constructor(size: number) {
        this.#buffer = new Float32Array(size);
        this.#capacity = size;
        this.#length = 0;
    }


    clear() {
        this.#length = 0;
    }
    log() {
        console.log(this.#buffer);
    }

    push(...args: number[]) {
        for (let i = 0; i < args.length; i++) {
            if (this.#length >= this.#capacity) {
                this.resize(this.#capacity * 2);
            }
            this.#buffer[this.#length++] = args[i];
        }
    }

    pop() {
        const element = this.#buffer[this.#length - 1];
        this.#buffer[--this.#length] = 0; // Use 0 instead of undefined for typed arrays
        return element;
    }

    shift() {
        if (this.#length === 0) {
            return undefined;
        }
        const element = this.#buffer[0];
        for (let i = 1; i < this.#length; i++) {
            this.#buffer[i - 1] = this.#buffer[i];
        }
        this.#buffer[--this.#length] = 0;
        return element;
    }

    unshift(...args: number[]) {
        if (args.length === 0) return this.#length;

        const newSize = this.#length + args.length;

        if (newSize > this.#capacity) {
            this.resize(Math.max(newSize, this.#capacity * 2));
        }

        for (let i = this.#length - 1; i >= 0; i--) {
            this.#buffer[i + args.length] = this.#buffer[i];
        }

        for (let i = 0; i < args.length; i++) {
            this.#buffer[i] = args[i];
        }
        this.#length = newSize;
        return this.#length;
    }

    resize(size: number) {
        const newBuffer = new Float32Array(size);
        for (let i = 0; i < this.#length; i++) {
            newBuffer[i] = this.#buffer[i];
        }
        this.#buffer = newBuffer;
        this.#capacity = size;
    }

    get length() {
        return this.#capacity;
    }

    get buffer() {
        return this.#buffer;
    }
}