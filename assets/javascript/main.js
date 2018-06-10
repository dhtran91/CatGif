
let topics = ["Dog", "Cat", "Bird", "Panda", "Monkey"];
let $buttonArea = $('#animal-btn');

let limit = 10;
let offset = 0;
let animal;
let additionalGif = false;
let favorites = [];
let home = "";
function populateButton() {

    $buttonArea.empty();
    for (let i = 0; i < topics.length; i++) {
        let newButton = $(`<button class='animal btn' data-name='${topics[i]}'> ${topics[i]} </button>`)

        $buttonArea.append(newButton);
    }
    $buttonArea.append($('<hr>'))
}

function queryGif() {
    let $gifView = $('#gif-view');
    if (!additionalGif) {
        $gifView.empty();
        offset = 0;
        animal = $(this).attr("data-name");
    }
    additionalGif = false;

    let queryURL = "https://api.giphy.com/v1/gifs/search?api_key=2vO0utIiJekaNYg9mRz0BBJiEnYdZmXJ&offset=" + offset + "&limit=" + limit + "&q=funny-" + animal;
    $.ajax({
        url: queryURL,
        method: "Get"
    })
        .then(function (response) {
            console.log(response)
            for (let i = 0; i < limit; i++) {

                let animalImage = $('<img>').attr({
                    "src": response.data[i].images.fixed_height_still.url,
                    "data-still": response.data[i].images.fixed_height_still.url,
                    "data-animate": response.data[i].images.fixed_height.url,
                    "data-state": "still",
                    "class": "gif"
                });
                let p = $('<p>').html("Title: " + response.data[i].title + "<br>Rating: " + response.data[i].rating);
                // let a = $(`<a href=${response.data[i].images.original.mp4} download>Click Here to Download</a>`)
                let favoriteBtn = $('<button class="favorite">Favorite It!</button>')
                let animalDiv = $('<div>').addClass('col-md-3 col-sm-4 col-xs-12').css({ 'width': response.data[i].images.fixed_height.width, 'margin': '10px' }).append(animalImage, p, favoriteBtn);

                $gifView.append(animalDiv);

            }
        })
}



populateButton();
$(document).on('click', '.animal', queryGif);
$(document).on('click', '#search-animal', function (event) {
    event.preventDefault();

    if ($('#animal-input').val()) {
        let animal = $('#animal-input').val().trim();
        topics.push(animal);
    } else {
        return;
    }

    populateButton();
})

$(document).on('click','.favorite', function(event) {
    // favorites.push($(this).parent("div").html());
    favorites.push($(this).parent().get(0));
    
    
})

$(document).on('click','#clear', function(){
    home = [];
    $('#gif-view').empty();
})

$(document).on('click', '#additional-gif', function () {

    offset += 10;
    additionalGif = true;
    queryGif();
    home = $('#gif-view').html();
});

$(document).on('click', '.gif', function () {
    let state = $(this).attr('data-state');
    if (state === 'still') {
        $(this).attr('src', $(this).attr('data-animate'));
        $(this).attr('data-state', 'animate');

    } else {
        $(this).attr('src', $(this).attr('data-still'));
        $(this).attr('data-state', 'still');
    }
});

$(document).on('click', '#favorites', function() {
    let $gifView = $('#gif-view');
    home = $gifView.html();
    $gifView.empty();
    if(favorites.length === 1) {
        $gifView.html(favorites);
    } else {
        for(let i = 0; i < favorites.length;i ++) {
            // $gifView.append($(`<div>${favorites[i]}</div>`) );
            $gifView.append(favorites[i]);
        }
    }
    
    
})

$(document).on('click', '#home', function() {
    if(home === "") {
        return;
    } else {
        let $gifView = $('#gif-view');
        $gifView.empty()
        $gifView.html(home);
    }

    
})