export class MusicTheoryUtils {
    private static noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    static frequencyToNote(frequency: number): string {
        const midiNumber = this.frequencyToMidi(frequency);
        const noteIndex = midiNumber % 12;
        const octave = Math.floor(midiNumber / 12) - 1;
        return `${this.noteNames[noteIndex]}${octave}`;
    }

    static frequencyToMidi(frequency: number): number {
        return Math.round(69 + 12 * Math.log2(frequency / 440));
    }

    static midiToFrequency(midi: number): number {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    static getChordType(notes: string[]): string {
        const intervals = this.getIntervals(notes);

        if (intervals.includes(4) && intervals.includes(7)) return 'Major';
        if (intervals.includes(3) && intervals.includes(7)) return 'Minor';
        if (intervals.includes(3) && intervals.includes(6)) return 'Diminished';
        if (intervals.includes(4) && intervals.includes(8)) return 'Augmented';
        if (intervals.includes(4) && intervals.includes(7) && intervals.includes(11)) return '7th';
        if (intervals.includes(3) && intervals.includes(7) && intervals.includes(10)) return 'Minor 7th';

        return 'Unknown';
    }

    private static getIntervals(notes: string[]): number[] {
        const rootNote = this.noteNames.indexOf(notes[0].charAt(0));
        return notes.slice(1).map(note => {
            const noteIndex = this.noteNames.indexOf(note.charAt(0));
            return (noteIndex - rootNote + 12) % 12;
        });
    }
}