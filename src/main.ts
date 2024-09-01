import './style.css'
import Controls from "./Components/Controls";
import {WavePlotter} from "./WavePlotter";









document.addEventListener('DOMContentLoaded', () => {

    const plotter = new WavePlotter({
        frequency: 0.01,
        waveType: 'sine',
        scaleY: 1,
        scaleX: 1,
        canvasWidth: 800,
        canvasHeight: 300,
        noiseLevel: 0
    })




    document.querySelector<HTMLDivElement>('#app')!.appendChild(plotter.getCanvas());
    document.querySelector<HTMLDivElement>('#app')!.appendChild(Controls(plotter.getAmplitude()));
    plotter.drawWave();
    plotter.drawGrid();
    plotter.addCursorTracking();
    document.getElementById("myRange")?.addEventListener("input", (e) => {
        const frequency = parseInt((e.target as HTMLInputElement).value, 10) / 100;
        document.getElementById("frequencyValue")!.textContent = frequency.toFixed(2);
        plotter.setFrequency(frequency);
    });

    document.getElementById("amplitudeInput")?.addEventListener("input", (e) => {
        const amplitude = parseInt((e.target as HTMLInputElement).value, 10);
        document.getElementById("amplitudeValue")!.textContent = amplitude.toString();
        plotter.setAmplitude(amplitude);
    });

    document.getElementById("waveType")?.addEventListener("change", (e) => {
        const waveType = (e.target as HTMLSelectElement).value as 'sine' | 'cosine';
        plotter.setWaveType(waveType);
    });

    document.getElementById("noiselevel")?.addEventListener("input", (e) => {

        const noiseLevel = (e.target as HTMLSelectElement).value
        document.getElementById("noiseLevelValue")!.textContent = noiseLevel.toString();
        plotter.setNoiseLevel(Number(noiseLevel));
    });

    document.getElementById("scaleX")?.addEventListener("input", (e) => {
        const scaleX = parseFloat((e.target as HTMLInputElement).value);
        document.getElementById("scaleXValue")!.textContent = scaleX.toString();
        plotter.setScaleX(scaleX);
    });

    document.getElementById("scaleY")?.addEventListener("input", (e) => {
        const scaleY = parseFloat((e.target as HTMLInputElement).value);
        document.getElementById("scaleYValue")!.textContent = scaleY.toString();
        plotter.setScaleY(scaleY);

    });

    document.getElementById('startBtn')?.addEventListener('click', () => {
        plotter.startAnimation();
    });

    document.getElementById('stopBtn')?.addEventListener('click', () => {
        plotter.stopAnimation();
    });
})

