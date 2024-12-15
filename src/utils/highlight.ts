// Функция для начала подсветки
function highlightButton(button: HTMLElement | null) {
    button?.classList.add('highlight');
}

// Функция для завершения подсветки
function stopHighlight(button: HTMLElement | null) {
    button?.classList.remove('highlight');
}

// Функция для привлечения внимания
export function attractAttention(button: HTMLElement | null) {
    highlightButton(button);
    // Останавливаем подсветку через 5 секунд (например)
    setTimeout(()=>stopHighlight(button), 2000);
}