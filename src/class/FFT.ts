export class FFT {
    private n: number;
    private reverseTable: Uint32Array;
    private sinTable: Float64Array;
    private cosTable: Float64Array;

    constructor(n: number) {
        this.n = n;
        this.reverseTable = new Uint32Array(n);
        this.sinTable = new Float64Array(n);
        this.cosTable = new Float64Array(n);

        this.initializeTables();
    }

    private initializeTables(): void {
        let i: number;
        const n = this.n;
        const log2n = Math.log2(n);

        for (i = 0; i < n; i++) {
            let rev = 0;
            for (let j = 0; j < log2n; j++) {
                rev <<= 1;
                rev |= (i & (1 << j)) ? 1 : 0;
            }
            this.reverseTable[i] = rev;
        }

        const theta = -2 * Math.PI / n;
        for (i = 0; i < n; i++) {
            this.sinTable[i] = Math.sin(theta * i);
            this.cosTable[i] = Math.cos(theta * i);
        }
    }

    transform(real: Float64Array, imag: Float64Array): void {
        const n = this.n;
        const sinTable = this.sinTable;
        const cosTable = this.cosTable;
        const reverseTable = this.reverseTable;

        for (let i = 0; i < n; i++) {
            const rev = reverseTable[i];
            if (rev > i) {
                [real[i], real[rev]] = [real[rev], real[i]];
                [imag[i], imag[rev]] = [imag[rev], imag[i]];
            }
        }

        for (let size = 2; size <= n; size *= 2) {
            const halfsize = size / 2;
            const tablestep = n / size;

            for (let i = 0; i < n; i += size) {
                for (let j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
                    const tpre = real[j+halfsize] * cosTable[k] + imag[j+halfsize] * sinTable[k];
                    const tpim = -real[j+halfsize] * sinTable[k] + imag[j+halfsize] * cosTable[k];

                    real[j + halfsize] = real[j] - tpre;
                    imag[j + halfsize] = imag[j] - tpim;
                    real[j] += tpre;
                    imag[j] += tpim;
                }
            }
        }
    }

    calculateMagnitudes(real: Float64Array, imag: Float64Array): Float64Array {
        const n = this.n;
        const magnitudes = new Float64Array(n / 2);

        for (let i = 0; i < n / 2; i++) {
            magnitudes[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
        }

        return magnitudes;
    }

    frequencyBin(index: number, sampleRate: number): number {
        return index * sampleRate / this.n;
    }
}