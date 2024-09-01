function Controls (amplitude: number, noiseLevel: number = 0) {
    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML = `<label for="myRange">Frequency: </label>

    <input type="range" id="myRange" min="1" max="10" value="1">
    <span id="frequencyValue">0.01</span>
    <br>
    <label for="amplitudeInput">Amplitude: </label>
    <input type="range" id="amplitudeInput" min="10" max=${amplitude} value=${amplitude}>
    <span id="amplitudeValue">${amplitude}</span>
    <br>
    <label for="noiselevel">NoiseLevel: </label>
    <input type="range" id="noiselevel" min=${noiseLevel} max="20" value=${noiseLevel}>
    <span id="noiseLevelValue">${noiseLevel}</span>
    <br>
    <label for="waveType">Wave Type: </label>
    <select id="waveType">
        <option value="sine">Sine</option>
        <option value="cosine">Cosine</option>
    </select>
    <button id="startBtn">Start Animation</button>
    <button id="stopBtn">Stop Animation</button>
`
    return controls;
}


export default Controls