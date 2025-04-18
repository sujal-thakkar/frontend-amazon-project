import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export const deliveryOptions = [
    {
        id: '1',
        deliveryDays: 7,
        priceCents: 0
    },
    {
        id: '2',
        deliveryDays: 3,
        priceCents: 499,
    },
    {
        id: '3',
        deliveryDays: 1,
        priceCents: 999
    }
]

export function getDeliveryOption(deliveryOptionId) {
    let deliveryOption;

    deliveryOptions.forEach((option) => {
        if (deliveryOptionId === option.id) deliveryOption = option;
    });

    return deliveryOption || deliveryOptions[0];
}

function isWeekend(date) {
    const day = date.format('dddd');
    if(day === 'Saturday' || day === 'Sunday') return true;
    else return false;
}

export function calculateDeliveryDate(deliveryOption) {
    let deliveryDate = dayjs();

    let daysNeedToAdd = deliveryOption.deliveryDays;

    while(daysNeedToAdd) {
        deliveryDate = deliveryDate.add(1, 'days');

        if(!isWeekend(deliveryDate)) daysNeedToAdd--;
    }

    const dateString = deliveryDate.format('dddd, MMMM D');
    
    return dateString;
}