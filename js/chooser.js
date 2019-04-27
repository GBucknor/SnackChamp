const names = [
    'David Barrera',
    'Madeline Luke',
    'Jordan Lin',
    'Ricardo Visbal',
    'Thomas Alain',
    'Liza Park',
    'Calex Peterson',
    'Peter Reimer',
    'Garel Bucknor',
    'Ryan Stoppler',
    'Doug Jodrell',
    'Liz Kundilivskaya',
    'Michael Cillis',
    'Geri Vallee',
    'Brian Anderson'
];
let defaultDay = 0;
const getTextDay = (dayNumber) => {
    let days = [
        'Monday',
        'Wednesday',
    ];
    return days[dayNumber];
}

const rollForChamp = () => {
    let numberOfOptions = names.length;
    $('#roll-text').html(
        names[Math.floor(Math.random() * Math.floor(numberOfOptions))]
    );
}

const deceleratingTimeout = (callback, factor, times) => {
    let internalCallback = function(tick, counter) {
        return () => {
            if (--tick >= 0) {
                window.setTimeout(internalCallback, ++counter * factor);
                callback();
            } else {
                let row = $('<tr></tr>');
                let day = $('<td></td>').html(getTextDay(defaultDay));
                let name = $('<td></td>').html($('#roll-text').html());
                $(row).append(day);
                $(row).append(name);
                $('#champs').append(row);
                (++defaultDay > 1) ? $('#btn-circle').attr('disabled', true) : null;
            }
        }
    } (times, 0);
    window.setTimeout(internalCallback, factor);
}

const rollingSim = () => {
    deceleratingTimeout(rollForChamp, 5, 40);
}