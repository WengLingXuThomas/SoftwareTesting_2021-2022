// @ts-nocheck
import { getLyrics, getSong } from 'genius-lyrics-api-afmod';
import {GeniusCred} from '../../app/credentials'

let genius_options = {
    apiKey: GeniusCred.client_acces_token,
    title: '',
    artist: '',
    optimizeQuery: true
};

export async function findLyrics(title:string,artist:string){
    return new Promise(async (resolve, reject) => {

        await getOvhLyrics(title, artist).then(async (ovhData) => {
            if (!('error' in ovhData)) {
                resolve(ovhData);
            }else if('error' in ovhData){
                genius_options.title = title;
                genius_options.artist = artist;

                await getGeniusLyrics().then(async (genData) => {
                    if (genData != null) {
                        resolve({lyrics:genData});
                    }else{
                        //alert("no results");
                        resolve({error:genData});          
                    }
                })
            }
        });
    })
}

async function getGeniusLyrics(){
    return new Promise(async (resolve, reject) => {
        await getLyrics(genius_options).then((lyrics) => resolve(lyrics));
    })
}

let ovhBaseUrl = "https://api.lyrics.ovh/v1/"

async function getOvhLyrics(title, artist){
    return new Promise(async (resolve, reject) => {
        fetch(ovhBaseUrl+`${artist}/${title}`)
        .then(function(resp) {
            return resp.json();
        })
        .then(function handleSuccess(data) {
            resolve(data);
        })
        .catch(function(err) {
            alert(err);
        });
    });
}
