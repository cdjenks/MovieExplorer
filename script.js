//Event handler for search button being clicked
$("#search-button").on('click', function (event) {
    event.preventDefault();
    let inputMovie = $("#movie-input").val().trim();
    getMovieData(inputMovie);
    //Clearing input field
    $("#movie-input").val("");
});
//Event handler for "enter" button being pressed to submit movie title
$("#movie-input").keyup(function (event) {
    if (event.keyCode == 13) {

        event.preventDefault();
        $("#search-button").click();
    }
});

//Function that updates styling depending on whether movies or tv shows is selected
function movieOrTVShow() {
    let isChecked = document.getElementById("flexSwitch").checked;
    //let isChecked = $('#flexSwitch').checked;???????
    if (isChecked === true) {
        $("#is-movie").removeClass("highlighted")
        $("#is-tvshow").addClass("highlighted")
        //Remove related movies label and any related movie posters from a prior search when TV Shows is selected
        $("#similar-movies-label").addClass("hide")
        $("#similar-movies").html('');
    } else {
        $("#is-movie").addClass("highlighted")
        $("#is-tvshow").removeClass("highlighted")

    }

};

function getMovieData(inputMovie) {
    //Clear out related movie results from past searches
    $("#similar-movies").html('');
    //Check if user is searching for a movie or TV show
    let isChecked = document.getElementById("flexSwitch").checked;
    console.log(isChecked)
    if (isChecked === true) {
        console.log("True")
        searchURL = `https://api.themoviedb.org/3/search/tv?api_key=f525ce5267c2b7a71ca77cde7ecb1c1b&language=en-US&page=1&query=${inputMovie}&include_adult=false`
        //Decided to call dif function for TV Show searches because of different structure of response object
        return getTvShowData(searchURL);
    } else {
        console.log("False")
        searchURL = `https://api.themoviedb.org/3/search/movie?api_key=f525ce5267c2b7a71ca77cde7ecb1c1b&language=en-US&query=${inputMovie}&page=1&include_adult=false
    include_adult=false`;
    }

    $.ajax({
        url: searchURL,
        method: "GET"
    }).then(function (response) {
        //constructing poster url
        let posterURL = "https://image.tmdb.org/t/p/w500/" + response.results[0].poster_path;
        //populating search data in info section
        $("#movie-poster").attr("src", posterURL);
        $("#movie-title").text(response.results[0].title);
        $("#movie-summary").text(response.results[0].overview);
        $("#release-date").text("Release Date: " + response.results[0].release_date);

        let similarMoviesURL = `https://api.themoviedb.org/3/movie/${response.results[0].id}/similar?api_key=f525ce5267c2b7a71ca77cde7ecb1c1b&language=en-US&page=1`
        //Call function to fetch and display other movies catagorized as being similar
        getSimilarMovies(similarMoviesURL);

    }).fail(error => {
        $("#movie-poster").attr("src", "./sadface.png");
        $("#movie-title").html('');
        $("#movie-summary").html('');
        $("#release-date").html('');
        $('#movie-summary').text("Oops! No results found. Please try another search!");
        console.log(error)

    })
};

function getTvShowData(searchURL) {

    $.ajax({
        url: searchURL,
        method: "GET"
    }).then(function (response) {

        let posterURL = "https://image.tmdb.org/t/p/w500/" + response.results[0].poster_path;
        //populating search data in info section
        $("#movie-poster").attr("src", posterURL);
        $("#movie-title").text(response.results[0].name);
        $("#movie-summary").text(response.results[0].overview);
        $("#release-date").text("First Air Date: " + response.results[0].first_air_date);

    }).fail(error => {
        $("#movie-poster").attr("src", "./sadface.png");
        $("#movie-title").html('');
        $("#release-date").html('');
        $('#movie-summary').text("Oops! No results found. Please try another search!");
        console.log(error)

    })
};

function getSimilarMovies(similarMoviesURL) {

    $.ajax({
        url: similarMoviesURL,
        method: "GET"
    }).then(function (response) {
        $("#similar-movies").html('');
        $("#similar-movies-label").removeClass("hide")
        for (let i = 0; i <= 20; i++) {
            if (response.results[i].popularity > 30) {

                let similarPosterURL = "https://image.tmdb.org/t/p/w500/" + response.results[i].poster_path;
                let similarPoster = $("<img>").attr("src", similarPosterURL);
                let similarMovieDiv = $("<div>").addClass("poster-card card card-body").attr("title", response.results[i].title);
                similarMovieDiv.append(similarPoster);
                $("#similar-movies").append(similarMovieDiv);
                //It seems like the only way to add an event handler to a dynamicallyl rendered image was to add into the constructor flow
                $(".poster-card").on('click', function () {
                    $(window).scrollTop(0);
                    let similarTitle = ($(this).attr('title'));
                    getMovieData(similarTitle);

                });

            }

        }

    }).fail(error => {
        console.log(error)

    })
};

//Page will initially load with "movies" being highlighted rather than neither of the options
movieOrTVShow();