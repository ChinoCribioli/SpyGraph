const APIController = (function() {
    const client_id = 'ab57d209083846459efd255b1b62b4d5';
    const client_secret = '237e31d7c23e4265af9d5367ff02ce86';
    
    const _getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(client_id + ':' + client_secret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token; 
    }

    const _getGenres = async (token) => {
        const result = await fetch(`https://api.spotify.com/v1/browse/cathegories?locale=sv_US`, {
            method: 'GET',
            headers: {'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data.categories.items;
    }

    const _getTrack = async (token,track_id) => {
        const result = await fetch(`https://api.spotify.com/v1/tracks/` + track_id,{
            method: 'GET',
            headers: {'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getTrack(token,track_id){
            return _getTrack(token,track_id);
        }
    }
})();