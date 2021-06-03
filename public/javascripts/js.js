//https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow


var token = document.getElementById("token").innerHTML;
const refresh = document.getElementById("refresh").innerHTML;
const url = 'https://api.spotify.com/v1/me/player/currently-playing';
const refreshUrl = 'https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token='+refresh;

async function getSpotify() {
    fetch(url, {
        method: "GET",
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + token
        }
    })
    .then( response => response.json() )
    .then( json => displayResult(json) )
    .catch( err => noMusic() );
};

async function displayResult(datas) {

    if (datas.error) {

        //le token est expiré
        document.getElementById("overlay").style.display = "none";
        document.getElementById("info").innerHTML = datas.error.message;

        //Get e new token with the refresh one
        getNewToken();

    } else {

        document.getElementById("overlay").style.display = "flex";
        document.getElementById("info").innerHTML = "";

        try {
            
            //meta
            let title = datas.item.name;

            if (title.length > 20) {
                title = title.substring(0, 19);
                title = title + "...";
            }
            
            let meta = "";
            datas.item.artists
            .forEach(element => {
                meta = meta + ", " + element.name;
            });
            meta = meta.substring(2);

            if (meta.length > 30) {
                meta = meta.substring(0, 29);
                meta = meta + "...";
            }

            let imageUrl = datas.item.album.images[0].url;
            document.getElementById("image").setAttribute("src", imageUrl);
            
            //time
            let time = Math.floor(parseInt(datas.progress_ms) / 1000);
            // console.log(time);
            let totTime = Math.floor(parseInt(datas.item.duration_ms) / 1000);
            // console.log(totTime);
            progress = Math.floor((time/totTime) * 100);

            document.getElementById("progress").style.width = progress + "%";
            document.getElementById("title").innerHTML = title;
            document.getElementById("meta").innerHTML = meta;
        } catch (error) {
            console.log(error)
        }
    }

    //actualise
    setTimeout( () => getSpotify(), 1000 );
}

function noMusic() {

    document.getElementById("overlay").style.display = "none";
    document.getElementById("info").innerHTML = "Aucun titre en cours de lecture"

    setTimeout( () => getSpotify(), 1000 );
}

function getNewToken() {

    const refreshUrl = 'https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token='+refresh;
    
    fetch(refreshUrl, {
        method: "POST",
        headers: {
            'Authorization': 'Basic MGQ2YWNlYzIwNjRkNDNiNGFlNjFmNjI5MTU1YmNhNDA6OTQ3YjVkYWUwNDdjNDc2NzkxMTQyOTE1Mjk4N2U1OWQ=',
            'Content-Type': 'application/x-www-form-urlencoded'    
        }
    })
    .then( response => response.json() )
    .then( json => { 
        window.location = "./spotify?token="+json.access_token;
    } )
    .catch( err => console.log(err) );
}

getSpotify();