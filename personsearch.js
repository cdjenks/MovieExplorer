//Event handler for search button being clicked
$("#search-button").on('click', function (event) {
    event.preventDefault();
    let inputPerson = $("#person-input").val().trim();
    getPersonID(inputPerson);
    //Clearing input field
    $("#person-input").val("");
});
//Event handler for "enter" button being pressed to submit person's name
$("#person-input").keyup(function (event) {
    if (event.keyCode == 13) {

        event.preventDefault();
        $("#search-button").click();
    }
});

function getPersonID(inputPerson) {

    let searchURL = `https://api.themoviedb.org/3/search/person?api_key=f525ce5267c2b7a71ca77cde7ecb1c1b&language=en-US&query=${inputPerson}&page=1&include_adult=false`

    $.ajax({
        url: searchURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.results[0]);
        //Clear noteable performances from past searches and display label if first search since page load
        $("#known-for-movies").html('');
        $("#known-for-label").removeClass("hide");
        for (let i = 0; i < response.results[0].known_for.length; i++) {
            //Ternary to deteremine if noteable performance was in a movie or TV show since a TV Show's title is stored as "name" in the response object
            let knownForMovie = (response.results[0].known_for[i].title ? $("<li>").text(response.results[0].known_for[i].title) : $("<li>").text(response.results[0].known_for[i].name))
            let knownForMovieDiv = $("<div>")
            knownForMovieDiv.append(knownForMovie);
            $("#known-for-movies").append(knownForMovieDiv);
        }
        //2nd ajax request to get person details after having secured person ID from first request
        let personID = response.results[0].id;
        detailsURL = `https://api.themoviedb.org/3/person/${personID}?api_key=f525ce5267c2b7a71ca77cde7ecb1c1b&language=en-US`

        $.ajax({
            url: detailsURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)

            let headshotURL = "https://image.tmdb.org/t/p/w500/" + response.profile_path;

            $("#person-headshot").attr("src", headshotURL);
            $('#person-name').text(response.name);
            $('#person-biography').text(response.biography);
            $('#person-dob').text("Birthdate: " + response.birthday);

        }).fail(error => {
            console.log("Issue fetching person details")
            console.log(error)

        })

    }).fail(error => {
        $("#known-for-label").addClass("hide");
        $("#person-headshot").attr("src", "./sadface.png");
        $("#person-name").html('');
        $("#person-dob").html('');
        $('#person-biography').text("Oops! No results found. Please try another search!");
        console.log("Issue fetching ID")
        console.log(error)

    })
};