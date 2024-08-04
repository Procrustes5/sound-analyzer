declare module 'sound-analyzer' {
    export class GuitarAnalyzer {
        constructor();
        loadAudio(audioFile: File): Promise<Float32Array>;
        analyzeFrequencies(audioData: Float32Array): number[];
        detectNotes(frequencies: number[]): string[];
        analyzeChords(notes: string[]): string;
        analyze(audioData: Float32Array): { notes: string[], chord: string };
    }
}