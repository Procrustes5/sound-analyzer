import { SoundAnalyzer } from './soundAnalyzer';

const analyzer = new SoundAnalyzer();

const fileInput = document.getElementById('audioFileInput') as HTMLInputElement;
const resultDiv = document.getElementById('result') as HTMLDivElement;

fileInput.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const audioData = await analyzer.loadAudio(file);
        const result = analyzer.analyze(audioData);
        resultDiv.innerHTML = `
      <h2>Analysis Result</h2>
      <p>Detected notes: ${result.notes.join(', ')}</p>
      <p>Detected chord: ${result.chord}</p>
    `;
    }
});