/**
 * Picks 2 people from your team to bring in snacks next week.
 * 
 * @author Garel Bucknor
 * @date May 
 */

/* Squad member names */

let names = [];
let squad;
let days = [];
let nameOverride = null;
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

/*
    NOTIFY.JS SETTINGS
*/
$.notify.addStyle('verdantgreen', {
    html: '<div>🎉 <strong><span data-notify-text /></strong> 🎉</div>',
    classes: {
        base: {
            'white-space': 'nowrap',
            'color': '#6CAE75',
            'background-color': '#EDEAD0',
            'padding': '5px'
        }
    }
});

$('#past-champ-modal').modal({
    keyboard: true
});

let defaultDay = 0;
let currentIndex = 0;

/* FUNCTIONS */
const getTextDay = (dayNumber) => {
    return days[dayNumber];
}

const undo = (btn) => {
    if (reserves.length > 0) {
        names.push(reserves.pop());
        $('#champs tr:last-child').remove();
        (defaultDay > days.length) ? toggleChampBtn($('#btn-circle')) : null;
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
        url: `https://snack-champ.herokuapp.com/api/v1/squads/reserves/${squad}`,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({reserves: reserves})
    }).done((msg) => {
        console.log('Data saved: ' + msg);
    });
    $('#save-btn').notify(
        'Success!', { 
            elementPosition: 'top center',
            style: 'verdantgreen'
        }
    );
}

const populateTractioniteTable = () => {
    let row = $('<tr></tr>');
    let day = $('<td></td>').html(getTextDay(defaultDay));
    if (defaultDay === 0 && nameOverride != null) {
        $('#roll-text').html(
            nameOverride
        );
    }
    let name = $('<td></td>').html($('#roll-text').html());
    $(row).append(day);
    $(row).append(name);
    $('#champs').append(row);
    if (nameOverride == null || defaultDay != 0) {
        reserves.push(names.splice(currentIndex, 1)[0]);
    }
    if (++defaultDay < days.length) {
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

const getSquad = () => {
    $('#welcome').fadeOut().promise().done(() => {
        $('#roller-holder').slideDown();
        $.ajax({
            url: `https://snack-champ.herokuapp.com/api/v1/squads/${squad}`,
            type: 'GET',
            dataType: 'json',
            success: (response) => {
                names = response.data;
                toggleChampBtn($('#btn-circle'));
                $('#main-spinner').css('display', 'none');
                $('#roll-text').fadeIn('slow');
            }
        });
    });
}

const getPastChamps = () => {
    $.ajax({
        url: `https://snack-champ.herokuapp.com/api/v1/squads/reserves/${squad}`,
        type: 'GET',
        dataType: 'json',
        success: (response) => {
            response.data.forEach(element => {
                let listItem = $(`<li class="list-group-item">${element}</>`);
                $('#past-champs').append(listItem);
            });
        }
    });
}

const squadSelected = () => {
    squad = nameParser($('#squad-select').find(':selected').text());
    if (squad != 'None') {
        getSquad();
        getPastChamps();
        $('input[name="days"]:checked').each(function() {
            days.push($(this).val());
        });
    }
}

const nameParser = (word) => {
    return word.replace(new RegExp(' ', 'g'), '+');
}

const rollingSim = () => {
    if (names.length > 1) {
        deceleratingTimeout(rollForChamp, 5, 40);
    } else {
        rollForChamp();
        populateTractioniteTable();
    }
    // For testing
    //deceleratingTimeout(rollForChamp, 5, 1);
}

const createPoll = () => {
    let pollBody = {
        'title': 'Who was the snack champion of last week?',
        'multi': false,
        'options': reserves.slice(reserves.length - 2, reserves.length - 1),
        'dupcheck': 'normal'
    };
    $.ajax({
        url: `https://strawpoll.me/api/v2/polls`,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(pollBody)
    }).done((data) => {
        console.log('Data saved: ' + data);
    });
}