
// Ждём полной загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    const introOverlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    const enterButton = document.getElementById('enter-button');
    const bgMusic = document.getElementById('bg-music');
    
    // Флаг, чтобы анимация не сработала дважды
    let isEntered = false;
    
    // Функция для входа на сайт
    function enterSite() {
        if (isEntered) return;
        isEntered = true;
        
        // Останавливаем музыку (если играет)
        bgMusic.pause();
        // Перематываем на начало
        bgMusic.currentTime = 0;
        
        // Запускаем музыку
        bgMusic.play().catch(error => {
            console.log('Автовоспроизведение заблокировано браузером');
            // Некоторые браузеры блокируют автовоспроизведение
            // Добавляем кнопку для ручного запуска, если нужно
        });
        
        // Добавляем класс для анимации исчезновения
        introOverlay.classList.add('fade-out');
        
        // Показываем основной контент с анимацией
        mainContent.style.display = 'block';
        mainContent.style.animation = 'fadeIn 1s ease';
        
        // Удаляем оверлей после анимации
        setTimeout(function() {
            introOverlay.style.display = 'none';
        }, 800);
    }
    
    // Обработчик нажатия на кнопку
    enterButton.addEventListener('click', enterSite);
    
    // Дополнительно: можно добавить нажатие на пробел или Enter
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !isEntered) {
            enterSite();
        }
    });
});


// Целевая дата: 18 июля 2026, 16:00 МСК
const targetDate = new Date(2026, 6, 18, 16, 0, 0);

// Общая длительность в миллисекундах (от начала года или условно)
// Для прогресса каждой единицы используем максимально возможное значение

function updateTimer() {
    const now = new Date();
    const remaining = targetDate - now;
    
    if (remaining <= 0) {
        // Таймер достиг нуля
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        setProgress('days-progress', 100);
        setProgress('hours-progress', 100);
        setProgress('minutes-progress', 100);
        setProgress('seconds-progress', 100);
        return;
    }
    
    // Расчёт значений
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    // Обновление текста
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    
    // Расчёт прогресса (сколько процентов от максимального значения осталось)
    // Для дней: максимум ~365, но лучше считать от общего количества дней до даты
    const totalDays = Math.ceil((targetDate - new Date(2026, 0, 1)) / (1000 * 60 * 60 * 24));
    const daysProgress = (days / totalDays) * 100;
    
    // Для часов: максимум 24
    const hoursProgress = (hours / 24) * 100;
    
    // Для минут: максимум 60
    const minutesProgress = (minutes / 60) * 100;
    
    // Для секунд: максимум 60
    const secondsProgress = (seconds / 60) * 100;
    
    // Применяем прогресс (инвертируем, т.к. круг должен уменьшаться)
    setProgress('days-progress', daysProgress);
    setProgress('hours-progress', hoursProgress);
    setProgress('minutes-progress', minutesProgress);
    setProgress('seconds-progress', secondsProgress);
}

function setProgress(elementId, percent) {
    const circle = document.getElementById(elementId);
    if (!circle) return;
    
    const radius = 45;
    const circumference = 2 * Math.PI * radius; // ≈ 282.6
    const dashoffset = circumference - (percent / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = dashoffset;
}

// Обновляем каждую секунду
setInterval(updateTimer, 1000);
updateTimer();


