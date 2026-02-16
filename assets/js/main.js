// Глобальная переменная для отслеживания времени
const startTime = Date.now();

// Модальное окно функциональность
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('measurementModal');
    const openModalBtns = document.querySelectorAll('.js-open-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const form = document.getElementById('tgForm');
    const submitBtn = document.getElementById('tgSubmitBtn');
    const statusDiv = document.getElementById('tgStatus');

    // Открытие модального окна
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    });

    // Закрытие модального окна
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Закрытие при клике вне окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Отправка формы
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Анти-бот проверка времени
            const timeSpent = (Date.now() - startTime) / 1000;
            if (timeSpent < 4) {
                statusDiv.textContent = 'Система защиты: пожалуйста, подождите немного...';
                return;
            }

            // Анти-бот проверка (honeypot)
            const botCheckField = form.querySelector('input[name="_bot_check"]');
            if (botCheckField && botCheckField.value.trim() !== '') {
                console.log('Bot detected');
                return;
            }

            // Получение Yandex ClientID
            let yandexId = 'не определен';
            try {
                if (typeof ym !== 'undefined' && ym(106849239, 'getClientID')) {
                    yandexId = ym(106849239, 'getClientID');
                }
            } catch (e) {
                console.log('Yandex ID не получен:', e);
            }

            // Заполняем скрытое поле yandex_id
            const yandexIdField = form.querySelector('input[name="yandex_id"]');
            if (yandexIdField) {
                yandexIdField.value = yandexId;
            }

            // Сбор данных формы
            const formData = new FormData(form);
            const data = {
                user_name: formData.get('user_name'),
                user_phone: formData.get('user_phone'),
                user_address: formData.get('user_address'),
                yandex_id: yandexId,
                time_spent: timeSpent.toFixed(1)
            };

            // Отладочная информация
            console.log('Отправляемые данные:', data);

            // Блокировка кнопки
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            statusDiv.textContent = '';

            try {
                // Отправка через Formspree
                const response = await fetch('https://formspree.io/f/mbdaykgw', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Яндекс.Метрика цель
                    if (typeof ym !== 'undefined') {
                        ym(106849239, 'reachGoal', 'lead_sent');
                    }
                    
                    statusDiv.textContent = '✅ Заявка отправлена! Мастер свяжется с вами.';
                    form.reset();
                    
                    // Закрытие модального окна через 3 секунды
                    setTimeout(() => {
                        modal.style.display = 'none';
                        statusDiv.textContent = '';
                    }, 3000);
                } else {
                    throw new Error('Ошибка отправки формы');
                }
            } catch (error) {
                console.error('Ошибка отправки:', error);
                statusDiv.textContent = `❌ Ошибка: ${error.message}`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ОТПРАВИТЬ';
            }
        });
    }
});
