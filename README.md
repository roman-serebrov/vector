# Grafic

Это учебный проект для визуализации звуковой волны с использованием TypeScript и Vite. Основная цель проекта — создать интерактивное приложение, которое отображает график звуковой волны и предоставляет различные возможности для взаимодействия с ним.

## Описание проекта

Приложение позволяет отрисовывать графики звуковых волн с использованием Canvas API и TypeScript. В проекте реализованы функции, которые делают графики более динамичными и интерактивными:

- **Анимация волны**: Иллюзия движения создается за счет изменения смещения (offset) и вызова функции отрисовки `drawWave()`, что делает график "живым".
- **Сетка (Grid)**: Добавлена сетка на график для улучшения визуального восприятия и ориентации.
- **Отслеживание курсора (Cursor Tracking)**: При наведении курсора на график отображается текущая точка на волне, которая следует по амплитуде и не выходит за пределы линий графика.
- **Разделение компонентов**: Архитектура проекта построена на разделении логики на компоненты для улучшения читаемости и поддерживаемости кода.

## Стек технологий

- **TypeScript**: Используется для строгой типизации и улучшения качества кода.
- **Vite**: Для разработки и сборки проекта, что обеспечивает быстрый запуск и обновление при разработке.
- **Canvas API**: Для отрисовки графиков звуковых волн.
