// Telegram API настройки
const TG_TOKEN = 'YOUR_BOT_TOKEN';
const CHAT_ID = 'YOUR_CHAT_ID';

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
            
            // Анти-бот проверка
            const botCheckField = form.querySelector('input[name="_bot_check"]');
            if (botCheckField && botCheckField.value.trim() !== '') {
                console.log('Bot detected');
                return;
            }

            // Сбор данных формы
            const formData = new FormData(form);
            const data = {
                user_name: formData.get('user_name'),
                user_phone: formData.get('user_phone'),
                user_address: formData.get('user_address')
            };

            // Блокировка кнопки
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            statusDiv.textContent = '';

            try {
                // Отправка в Telegram
                const message = `🏠 ЗАЯВКА НА ЗАМЕР (PROPLEX)
👤 Имя: ${data.user_name}
📞 Телефон: ${data.user_phone}
📍 Адрес: ${data.user_address || 'Не указан'}`;

                const response = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });

                if (response.ok) {
                    // Яндекс.Метрика цель
                    if (typeof ym !== 'undefined') {
                        ym(106787007, 'reachGoal', 'lead_sent');
                    }
                    
                    statusDiv.textContent = '✅ Заявка отправлена! Мастер свяжется с вами.';
                    form.reset();
                    
                    // Закрытие модального окна через 3 секунды
                    setTimeout(() => {
                        modal.style.display = 'none';
                        statusDiv.textContent = '';
                    }, 3000);
                } else {
                    throw new Error('Telegram API error');
                }
            } catch (error) {
                console.error('Ошибка отправки:', error);
                statusDiv.textContent = '❌ Ошибка отправки. Попробуйте еще раз.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ОТПРАВИТЬ';
            }
        });
    }
});
