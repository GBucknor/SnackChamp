/**
 * Picks 2 people from your team to bring in snacks next week.
 * @author Garel Bucknor
 */

/* VARIABLES */
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
    'Brian Anderson',
    'Daniel Lin',
    'Amir Khaledi'
];
let defaultDay = 0;
let currentIndex = 0;

/* FUNCTIONS */
const getTextDay = (dayNumber) => {
    let days = [
        'Monday',
        'Wednesday',
    ];
    return days[dayNumber];
}

const rollForChamp = () => {
    let numberOfOptions = names.length;
    currentIndex = Math.floor(Math.random() * Math.floor(numberOfOptions));
    $('#roll-text').html(
        names[currentIndex]
    );
}

const toggleBtn = (btn) => {
    if (btn.attr('disabled')) {
        btn.attr('disabled', false);
    } else {
        btn.attr('disabled', true);
    }
}

const populateTractioniteTable = () => {
    let row = $('<tr></tr>');
    let day = $('<td></td>').html(getTextDay(defaultDay));
    let name = $('<td></td>').html($('#roll-text').html());
    $(row).append(day);
    $(row).append(name);
    $('#champs').append(row);
    names.pop(currentIndex);
    (++defaultDay <= 1) ? toggleBtn($('#btn-circle')) : $('#roll-text').html('Enjoy your snacks!');
    (defaultDay > 0) ? $('#undo-btn').attr('hidden', false) : null;
}

const deceleratingTimeout = (callback, factor, times) => {
    let internalCallback = function(tick, counter) {
        toggleBtn($('#btn-circle'));
        return () => {
            if (--tick >= 0) {
                window.setTimeout(internalCallback, ++counter * factor);
                callback();
            } else {
                populateTractioniteTable();
            }
        }
    } (times, 0);
    window.setTimeout(internalCallback, factor);
}

const rollingSim = () => {
    deceleratingTimeout(rollForChamp, 5, 40);
}