import { FFT } from './class/FFT';
import { MusicTheoryUtils } from './utils/musicTheoryUtils';

export class SoundAnalyzer {
    private audioContext: AudioContext;
    private fft: FFT;

    constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.fft = new FFT(2048);  // 2048 포인트 FFT 사용
    }

    async loadAudio(audioFile: File): Promise<Float32Array> {
        const arrayBuffer = await audioFile.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer.getChannelData(0);
    }

    analyzeFrequencies(audioData: Float32Array): number[] {
        const real = new Float64Array(audioData);
        const imag = new Float64Array(audioData.length).fill(0);

        this.fft.transform(real, imag);
        const magnitudes = this.fft.calculateMagnitudes(real, imag);

        return this.findPeakFrequencies(magnitudes, this.audioContext.sampleRate);
    }

    private findPeakFrequencies(magnitudes: Float64Array, sampleRate: number): number[] {
        const peakFrequencies: number[] = [];
        const threshold = this.calculateThreshold(magnitudes);

        for (let i = 1; i < magnitudes.length - 1; i++) {
            if (magnitudes[i] > threshold &&
                magnitudes[i] > magnitudes[i - 1] &&
                magnitudes[i] > magnitudes[i + 1]) {
                const frequency = this.fft.frequencyBin(i, sampleRate);
                peakFrequencies.push(frequency);
            }
        }

        return peakFrequencies;
    }

    private calculateThreshold(magnitudes: Float64Array): number {
        const sum = magnitudes.reduce((a, b) => a + b, 0);
        return (sum / magnitudes.length) * 2;
    }

    detectNotes(frequencies: number[]): string[] {
        return frequencies.map(freq => MusicTheoryUtils.frequencyToNote(freq));
    }

    analyzeChords(notes: string[]): string {
        const uniqueNotes = Array.from(new Set(notes));
        if (uniqueNotes.length < 3) return 'Not enough notes for a chord';

        const rootNote = uniqueNotes[0].replace(/\d+/, ''); // Remove octave number
        const chordType = MusicTheoryUtils.getChordType(uniqueNotes.map(note => note.replace(/\d+/, '')));

        return `${rootNote} ${chordType}`;
    }

    analyze(audioData: Float32Array): { notes: string[], chord: string } {
        const frequencies = this.analyzeFrequencies(audioData);
        const notes = this.detectNotes(frequencies);
        const chord = this.analyzeChords(notes);

        return { notes, chord };
    }
}