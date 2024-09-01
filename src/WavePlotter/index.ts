import { Vector } from "../Vector";



export class WavePlotter {
    #canvas: HTMLCanvasElement;
    #ctx: CanvasRenderingContext2D | null;
    #vector: Vector;
    #amplitude: number;
    #frequency: number;
    #waveType: 'sine' | 'cosine';
    #scaleX: number;
    #scaleY: number;
    #midlD: number;
    #offset: number;
    #data: number[];
    #noiseLevel: number;
    animationFrameId: number | null;

    constructor(options: Options) {
        this.#canvas = this.createCanvas(options.canvasWidth || 800, options.canvasHeight || 300);
        this.#ctx = this.#canvas.getContext("2d") || null;
        this.#vector = new Vector(this.#canvas.width);
        this.#amplitude = this.calculateAmplitude(this.#canvas.height);
        this.#frequency = options.frequency || 0.01;
        this.#waveType = options.waveType || 'sine';
        this.#scaleX = options.scaleX || 1;
        this.#scaleY = options.scaleY || 1;
        this.#midlD = this.#canvas.height / 2;
        this.#offset = 0;
        this.#data = this.generateData(this.#vector.length, this.#amplitude, this.#frequency, options.noiseLevel);
        this.#noiseLevel = options.noiseLevel;
        this.animationFrameId = null;
    }

    createCanvas(width: number, height: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    calculateAmplitude(canvasHeight: number, scaleFactor: number = 0.8): number {
        return (canvasHeight / 2) * scaleFactor;
    }

    drawWave() {
        // Очищаем текущие данные и канвас
        this.#vector.clear();
        this.#ctx?.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        // Рисуем центральную линию
        if (this.#ctx) {
            this.#ctx.beginPath();
            this.#ctx.moveTo(0, this.#midlD);
            this.#ctx.lineTo(this.#canvas.width, this.#midlD);
            this.#ctx.strokeStyle = "red";
            this.#ctx.lineWidth = 1;
            this.#ctx.stroke();
        }

        // Пересчитываем значения с учетом смещения для анимации и добавляем шум
        for (let x = 0; x < this.#canvas.width; x++) {
            const sineValue = this.#amplitude * (this.#waveType === 'sine'
                ? Math.sin(this.#frequency * x + this.#offset)
                : Math.cos(this.#frequency * x + this.#offset));

            // Получаем шумовое значение из данных
            const noise = this.#data[x] - this.#amplitude * (this.#waveType === 'sine'
                ? Math.sin(this.#frequency * x)
                : Math.cos(this.#frequency * x));

            // Итоговое значение с учетом шума
            const y = sineValue + noise + this.#midlD;
            this.#vector.push(y);
        }

        // Рисуем волну, используя значения из вектора
        this.#ctx?.beginPath();
        if (this.#vector.buffer.length > 0) {
            this.#ctx?.moveTo(0, this.#vector.buffer[0] * this.#scaleY);
        }
        for (let x = 1; x < this.#vector.length; x++) {
            const y = this.#vector.buffer[x] * this.#scaleY;
            this.#ctx?.lineTo(x * this.#scaleX, y);
        }

        if (this.#ctx) {
            this.#ctx.strokeStyle = "blue";
            this.#ctx.lineWidth = 2;
            this.#ctx.stroke();
        }
    }

    drawGrid() {
        if (!this.#ctx) return;

        const gridSpacingX = 50; // Расстояние между вертикальными линиями
        const gridSpacingY = 50; // Расстояние между горизонтальными линиями


        this.#ctx.strokeStyle = 'rgba(25,19,19,0.9)';
        this.#ctx.lineWidth = 0.5;

        // Рисуем вертикальные линии
        for (let x = 0; x <= this.#canvas.width; x += gridSpacingX) {
            this.#ctx.beginPath();
            this.#ctx.moveTo(x, 0);
            this.#ctx.lineTo(x, this.#canvas.height);
            this.#ctx.stroke();
        }

        // Рисуем горизонтальные линии
        for (let y = 0; y <= this.#canvas.height; y += gridSpacingY) {
            this.#ctx.beginPath();
            this.#ctx.moveTo(0, y);
            this.#ctx.lineTo(this.#canvas.width, y);
            this.#ctx.stroke();
        }
    }

    addCursorTracking() {
        const tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '3px';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);

        this.#canvas.addEventListener('mousemove', (event) => {
            const rect = this.#canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) / this.#scaleX; // Учтём масштабирование по X
            const y = event.clientY - rect.top;
            const index = Math.floor(x);
            // Проверка на выход за пределы массива
            if (index < 0 || index >= this.#vector.buffer.length) {
                tooltip.style.display = 'none'; // Скрываем тултип, если индекс вне диапазона
                return;
            }

            const dataY = this.#data[index] * this.#scaleY; // Учитываем масштабирование по Y
            const canvasY = this.#midlD - dataY; // Преобразуем значение из буфера в координаты канваса

            // Отображение координат в тултипе
            tooltip.style.left = `${event.clientX + 10}px`;
            tooltip.style.top = `${event.clientY + 10}px`;
            tooltip.innerText = `X: ${index}, Y: ${canvasY.toFixed(2)}`;
            tooltip.style.display = 'block';

            // Рисуем курсорные линии
            if (this.#ctx) {
                this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
                this.drawWave();
                this.drawGrid();

                this.#ctx.beginPath();
                this.#ctx.moveTo(index * this.#scaleX, 0);
                this.#ctx.lineTo(index * this.#scaleX, this.#canvas.height);
                this.#ctx.moveTo(0, y);
                this.#ctx.lineTo(this.#canvas.width, y);
                this.#ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                this.#ctx.lineWidth = 1;
                this.#ctx.stroke();
            }
        });

        this.#canvas.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
            this.#ctx?.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
            this.drawWave(); // Перерисовываем график без курсорных линий
            this.drawGrid(); // Перерисовываем сетку
        });
    }
    setAmplitude(amplitude: number) {
        this.#amplitude = amplitude;
        this.#data = this.generateData(this.#vector.length, this.#amplitude, this.#frequency, this.#noiseLevel);
        this.drawWave();
        this.drawGrid();
    }

    setFrequency(frequency: number) {
        this.#frequency = frequency;
        this.#data = this.generateData(this.#vector.length, this.#amplitude, this.#frequency, this.#noiseLevel);
        this.drawWave();
        this.drawGrid();
    }

    setWaveType(waveType: 'sine' | 'cosine') {
        this.#waveType = waveType;
        this.#data = this.generateData(this.#vector.length, this.#amplitude, this.#frequency, this.#noiseLevel);
        this.drawWave();
        this.drawGrid();
    }

    setScaleX(scaleX: number) {
        this.#scaleX = scaleX;
        this.drawWave();
    }

    setScaleY(scaleY: number) {
        this.#scaleY = scaleY;
        this.drawWave();
    }

    getCanvas() {
        return this.#canvas;
    }

    getAmplitude() {
        return this.#amplitude;
    }

    setNoiseLevel(noiseLevel: number) {
        this.#noiseLevel = noiseLevel;
        this.#data = this.generateData(this.#vector.length, this.#amplitude, this.#frequency, this.#noiseLevel);
        this.drawWave();
        this.drawGrid();
    }

    animate() {
        this.#offset += 0.05; // Скорость анимации
        this.drawWave(); // Обновляем график
        this.animationFrameId = requestAnimationFrame(() => this.animate()); // Запрашиваем следующий кадр
    }

    startAnimation() {

        if (this.animationFrameId === null) {
            this.#offset = 0; // Сброс смещения
            this.animate(); // Запуск анимации
        }
    }

    stopAnimation() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    generateData(length: number, amplitude: number, frequency: number, noiseLevel: number): number[] {
        const data = [];
        this.#vector.clear();  // Очищаем вектор в начале генерации данных
        for (let i = 0; i < length; i++) {
            // Генерация синусоидальных данных с шумом
            const sineValue = this.#waveType === 'sine' ? amplitude * Math.sin(frequency * i) : amplitude * Math.cos(frequency * i);
            const noise = (Math.random() - 0.5) * noiseLevel; // Генерация шума
            const valueWithNoise = sineValue + noise; // Суммируем значение синуса и шум
            data.push(valueWithNoise);
        }
        this.#vector.push(...data);
        return data;
    }

}