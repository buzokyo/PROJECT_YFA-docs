# Журнал змін прошивки

Ця сторінка описує зміни PROJECT YFA у прошивці CANnectivity/Bridle для адаптера Waveshare RP2350-CAN.

## 2026-09-26 — Runtime-керування USER LED

Поточна збірка для завантаження:

```text
Файл: project-yfa-rp2350-can.uf2
Розмір: 113 664 байти
UF2 blocks: 222
SHA-256: 6479838C7243ABE683B8D5F98370518F022438FABF861C7D33FD884369F69AF8
```

Зміни:

- додано vendor-запит PROJECT YFA `0xF1` для читання runtime-налаштувань;
- додано vendor-запит PROJECT YFA `0xF2` для запису runtime-налаштувань;
- bit 0 поля налаштувань означає **примусово вимкнути USER LED**;
- `0xF2` використовує чотирибайтовий little-endian payload: `01 00 00 00` вимикає активність USER LED, а `00 00 00 00` повертає звичайне керування прошивкою;
- override LED працює лише під час поточного запуску й не записується у flash/NVS;
- reset або втрата живлення адаптера очищає override та повертає звичайне керування LED;
- Android-застосунок PROJECT YFA зберігає вибір користувача і повторно застосовує його після кожного підключення адаптера;
- коли користувач вимикає опцію **Вимкнути індикатор USER** при підключеному адаптері, застосунок використовує стандартний gs_usb IDENTIFY для одного підтверджувального блимання;
- USB product string змінено на **Project YFA CAN-USB adapter**;
- збільшено PROJECT YFA diagnostic build identifier для цієї ревізії прошивки.

Перевірка:

- Windows gs_usb benchmark двічі успішно пройшов зі звичайним блиманням USER LED;
- той самий benchmark двічі успішно пройшов після runtime-вимкнення LED;
- робота CAN/USB benchmark не змінилася при активному LED override.

## 2026-09-25 — Ізольовані TX-буфери

Базовий коміт прошивки: `649810f` — **gs_usb: isolate TX buffers for Project YFA**.

Зміни:

- розділено gs_usb host-frame buffering так, щоб USB-to-CAN TX використовував окремий TX-пул;
- великий RX/error пул залишено для безперервного приймання CAN-трафіку автомобіля;
- інтенсивний RX-трафік більше не може забрати буфери, потрібні для приймання нового host-to-device CAN-кадру;
- TX-буфер залишається закріпленим за передаванням через TX FIFO, CAN transmission, echo та USB IN completion.

Важлива конфігурація:

```text
CONFIG_USBD_GS_USB_POOL_SIZE=128
CONFIG_USBD_GS_USB_TX_POOL_SIZE=16
```

Цю зміну додано після того, як періодичні Android Active UDS TX timeout були пов'язані з виснаженням спільного пулу буферів під інтенсивним RX-трафіком.

## Ранні налаштування прошивки PROJECT YFA

Раніше для поточної збірки було встановлено базову конфігурацію:

```text
CONFIG_USBD_GS_USB_POOL_SIZE=128
CONFIG_CAN_FD_MODE=n
```

Також закріплена така поведінка:

- Classical CAN 500 kbit/s для PROJECT YFA;
- Android-транспорт очікує CAN clock 8 MHz;
- потрібні апаратні CAN timestamps;
- Raw CAN і Пасивний UDS використовують listen-only;
- Активний UDS використовує звичайний CAN-режим із передаванням;
- vendor-запит PROJECT YFA `0xF0` збережено для діагностики прошивки.

!!! note "Примітка"
    Цей журнал описує PROJECT YFA-специфічні зміни прошивки, а не повну upstream-історію релізів CANnectivity/Bridle.
