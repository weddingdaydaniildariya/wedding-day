


// URL вашего Google Apps Script (замените на свой)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx3_NADXSgNcw0ObB4UzSx1Q-r456vhxj1q60JfarZtp7JXu8uHiq20cO33nhzIZtFTKQ/exec';

// Ждём полной загрузки HTML перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    
    // Получаем элементы по ID
    const userNameInput = document.getElementById('userName');
    const attendanceYes = document.getElementById('attendanceYes');
    const attendanceNo = document.getElementById('attendanceNo');
    const submitBtn = document.getElementById('submitBtn');
    const allergiInput = document.getElementById('allergi');
    
    // Получаем все чекбоксы напитков
    const drinkCognac = document.getElementById('drinkCognac');
    const drinkSamogon = document.getElementById('drinkSamogon');
    const drinkWhiskey = document.getElementById('drinkWhiskey');
    const drinkChampagne = document.getElementById('drinkChampagne');
    const drinkWine = document.getElementById('drinkWine');
    const drinkWater = document.getElementById('drinkWater'); 
    const drinkGaz = document.getElementById('drinkGaz'); 
    
    // Проверяем, найдены ли все элементы
    if (!userNameInput) console.error('Элемент userName не найден');
    if (!attendanceYes) console.error('Элемент attendanceYes не найден');
    if (!attendanceNo) console.error('Элемент attendanceNo не найден');
    if (!submitBtn) console.error('Элемент submitBtn не найден');
    
    // Функция сбора данных из формы
    function getFormData() {
        // Получаем имя
        const name = userNameInput ? userNameInput.value.trim() : '';
        const allergi = allergiInput ? allergiInput.value.trim() : '';
        
        // Получаем выбранный вариант присутствия
        let attendance = '';
        if (attendanceYes && attendanceYes.checked) {
            attendance = 'Да';
        } else if (attendanceNo && attendanceNo.checked) {
            attendance = 'Нет';
        }
        
        // Собираем выбранные напитки
        const drinks = [];
        if (drinkCognac && drinkCognac.checked) drinks.push('Вино красное полусладкое');
        if (drinkSamogon && drinkSamogon.checked) drinks.push('Вино белое полусладкое');
        if (drinkWhiskey && drinkWhiskey.checked) drinks.push('Вино белое сухое');
        if (drinkChampagne && drinkChampagne.checked) drinks.push('Шампанское');
        if (drinkWine && drinkWine.checked) drinks.push('Водка');
        if (drinkWater && drinkWater.checked) drinks.push('Самогон');
        if (drinkGaz && drinkGaz.checked) drinks.push('Сок/Газировка');
        
        return { name, attendance, drinks, allergi };
    }
    
    // Проверка заполнения формы
    function validateForm(data) {
        if (!data.name) {
            alert('Пожалуйста, введите ваше имя');
            if (userNameInput) userNameInput.focus();
            return false;
        }
        if (!data.attendance) {
            alert('Пожалуйста, выберите, будете ли вы присутствовать');
            return false;
        }
        if (!data.allergi) {
            alert('Если у вас нет аллергии, пожалуйста напишите "нет"');
            if (allergiInput) allergiInput.focus();
            return false;
        }
        return true;
    }
    
    // Отправка данных в Google Sheets
    async function sendToGoogleSheets(data) {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                attendance: data.attendance,
                drinks: data.drinks,
                allergi: data.allergi
            })
        });
        return response;
    }
    
    // Очистка формы после отправки
    function clearForm() {
        if (userNameInput) userNameInput.value = '';
        if (allergiInput) allergiInput.value = '';
        if (attendanceYes) attendanceYes.checked = false;
        if (attendanceNo) attendanceNo.checked = false;
        if (drinkCognac) drinkCognac.checked = false;
        if (drinkSamogon) drinkSamogon.checked = false;
        if (drinkWhiskey) drinkWhiskey.checked = false;
        if (drinkChampagne) drinkChampagne.checked = false;
        if (drinkWine) drinkWine.checked = false;
        if (drinkWater) drinkWater.checked = false;
        if (drinkGaz) drinkGaz.checked = false;
    }
    
    // Главная функция отправки
    async function submitForm() {
        const formData = getFormData();
        
        if (!validateForm(formData)) {
            return;
        }
        
        // Блокируем кнопку и показываем статус
        const originalText = submitBtn ? submitBtn.textContent : 'Отправить';
        if (submitBtn) {
            submitBtn.textContent = '⏳ Отправка...';
            submitBtn.disabled = true;
        }
        
        try {
            await sendToGoogleSheets(formData);
            alert('Спасибо! Ваш ответ сохранён!');
            clearForm();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при отправке. Попробуйте ещё раз или свяжитесь с организаторами.');
        } finally {
            // Возвращаем кнопку в исходное состояние
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    }
    
    // Вешаем обработчик на кнопку (только если кнопка найдена)
    if (submitBtn) {
        submitBtn.addEventListener('click', submitForm);
    }
    
    // Отправка по Enter в поле имени
    if (userNameInput) {
        userNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitForm();
            }
        });
    }
    
    // Тестовая функция для проверки
    window.testForm = function() {
        const data = getFormData();
        console.log('Собранные данные:', data);
        alert('Данные собраны! Откройте консоль (F12) чтобы увидеть результат');
    };
    
    console.log('Скрипт загружен и готов к работе');
    
}); // Конец DOMContentLoaded
