/**
 * Picks 2 people from your team to bring in snacks next week.
 * 
 * @author Garel Bucknor
 * @date May 
 */

/* Squad member names */

let names = [];
const reserves = [];


/*
    AJAX calls
*/
$.ajax({
    url: 'https://snack-champ.herokuapp.com/api/v1/squads/Business+Technology',
    type: 'GET',
    dataType: 'json',
    success: (response) => {
        console.log(response.data);
        names = response.data;
        toggleChampBtn($('#btn-circle'));
        $('#main-spinner').css('display', 'none');
        $('#roll-text').fadeIn('slow');
    }
});

$.ajax({
    url: 'https://snack-champ.herokuapp.com/api/v1/squads/reserves/Business+Technology',
    type: 'GET',
    dataType: 'json',
    success: (response) => {
        response.data.forEach(element => {
            let listItem = $(`<li class="list-group-item">${element}</>`)
            $('#past-champs').append(listItem);
        });
    }
});

$.ajax({
    url: 'https://snack-champ.herokuapp.com/api/v1/squads/reserves/Business+Technology',
    type: 'GET',
    dataType: 'json',
    success: (response) => {
        response.data.forEach(element => {
            let listItem = $(`<li class="list-group-item">${element}</>`)
            $('#vote-champs').append(listItem);
        });
    }
});

$('#past-champ-modal').modal({
    keyboard: true
});

$('#vote-champ-modal').modal({
    keyboard: true
});

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

const undo = (btn) => {
    if (reserves.length > 0) {
        names.push(reserves.pop());
        $('#champs tr:last-child').remove();
        (defaultDay > 1) ? toggleChampBtn($('#btn-circle')) : null;
        (--defaultDay <= 0) ? $('#undo-btn').attr('hidden', true) : null;
    }
}

const rollForChamp = () => {
    let numberOfOptions = names.length;
    currentIndex = Math.floor(Math.random() * Math.floor(numberOfOptions));
    $('#roll-text').html(
        names[currentIndex]
    );
}

const toggleChampBtn = (btn) => {
    if (btn.attr('disabled')) {
        btn.attr('disabled', false);
    } else {
        btn.attr('disabled', true);
    }
}

const updateReserves = () => {
    $.ajax({
        url: 'https://snack-champ.herokuapp.com/api/v1/squads/reserves/Business+Technology',
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({reserves: reserves})
    }).done((msg) => {
        console.log('Data saved: ' + msg);
    });
}

const populateTractioniteTable = () => {
    let row = $('<tr></tr>');
    let day = $('<td></td>').html(getTextDay(defaultDay));
    let name = $('<td></td>').html($('#roll-text').html());
    $(row).append(day);
    $(row).append(name);
    $('#champs').append(row);
    reserves.push(names.splice(currentIndex, 1)[0]);
    if (++defaultDay <= 1) {
        toggleChampBtn($('#btn-circle'))
    } else {
        $('#roll-text').html('Enjoy your snacks!');
        $('#save-btn').attr('hidden', false);
    }
}

const deceleratingTimeout = (callback, factor, times) => {
    let internalCallback = function(tick, counter) {
        toggleChampBtn($('#btn-circle'));
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
    // For testing
    //deceleratingTimeout(rollForChamp, 5, 1);
}