/**
 * Picks 2 people from your team to bring in snacks next week.
 * 
 * @author Garel Bucknor
 * @date May 
 */

/* Squad member names */

let names = [];
let squad;
const reserves = [];


/*
    AJAX calls
*/
$.ajax({
    url:'https://snack-champ.herokuapp.com/api/v1/squads',
    type: 'GET',
    dataType: 'json',
    success: (response) => {
        const squadSelect = $('#squad-select');
        const noneOption = $('<option selected>None</option>');
        squadSelect.append(noneOption);
        response.data.forEach(element => {
            let listItem = $(`<option>${element}</option>`);
            squadSelect.append(listItem);
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
            $('#past-champs').append(listItem);
        });
    }
});

$('#past-champ-modal').modal({
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

const squadSelected = () => {
    squad = nameParser($('#squad-select').find(':selected').text());
    console.log(squad);
    if (squad != 'None') {
        $('#welcome').fadeOut().promise().done(() => {
            $('#roller-holder').fadeIn();
            $.ajax({
                url: `https://snack-champ.herokuapp.com/api/v1/squads/${squad}`,
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
        });
    }
}

const nameParser = (word) => {
    return word.replace(new RegExp(' ', 'g'), '+')
}

const rollingSim = () => {
    deceleratingTimeout(rollForChamp, 5, 40);
    // For testing
    //deceleratingTimeout(rollForChamp, 5, 1);
}