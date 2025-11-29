//Muuttujat HTML-sivun alueille
const kysymysalue = document.getElementById("kysymysalue");
const vastausalue = document.getElementById("vastausalue");

//Pelimuuttuja
const game = {
    //Alustetaan muuttujia peliin
    kysymys: [],
    kierros: 0,
    score: 0,

    //Init -funktio käynnistää pelin
    async init(name) {
        //Haetaan kysymys
        this.kysymys = await kysymyshaku(this.kierros);
        //Tallennetaan pelaajan nimi
        this.player_name = name
        //Printataan kysymys
        this.kysymysfunktio();
    },

    kysymysfunktio() {
        //Tarkastetaan kysymyksen muoto ja printataan se
        if (this.kysymys["kysymysteksti"][0] === "What is the distance between " || this.kysymys["kysymysteksti"][0] === "How many kilotons of CO2 emmission are produced on a flight between ") {
            kysymysalue.innerHTML = '';
            kysymysalue.innerHTML += this.kysymys["kysymysteksti"][0];
            kysymysalue.innerHTML += this.kysymys["kysymys"][0][0] +" and "+this.kysymys["kysymys"][1][0];
            kysymysalue.innerHTML += this.kysymys["kysymysteksti"][1]
        }
        else {
            kysymysalue.innerHTML = '';
            kysymysalue.innerHTML += this.kysymys["kysymysteksti"][0];
            kysymysalue.innerHTML += this.kysymys["kysymys"][0];
            kysymysalue.innerHTML += this.kysymys["kysymysteksti"][1]
        }

    //Tyhjennetään vastausalue
    vastausalue.innerHTML = "";

    //Luodaan jokaiselle vastaukselle painike
    for (let i = 1; i < 5; i++) {
        const button = document.createElement("button");

        button.textContent = this.kysymys[`vastaus${i}`][1];
        button.classList.add("vastausnappi");

        //Event listener jokaiselle napille jos niitä painaa
        button.addEventListener("click", () => {
            //Ajetaan vastauksen tarkistus
            this.handleAnswer(this.kysymys[`vastaus${i}`][2]);
        });

        //Printataan painike
        vastausalue.appendChild(button);
    }
    },

    //Vastauksen tarkistus
    handleAnswer(selectedIndex) {
        //Jos valitun vastauksen arvo oli 1, se on oikein
        if (selectedIndex === 1) {
            //Lisätään score ja kierros
            this.score++;
            this.kierros++;

            //Uusi kierros, jos kierrokset ovat täynnä, lopetetaan peli
            if (this.kierros < 16) {
                this.init();
            } else {
                this.gameover();
            }
        }
        //Jos valitun vastauksen arvo oli 0, lopetetaan peli
        else {
            this.gameover();
        }
    },

    //Printataan lopputulos
    gameover() {
        kysymysalue.textContent = this.player_name+`'s Quiz finished! Score: ${this.score}`;
        kysymysalue.innerHTML += "<br><button onclick='refresh()'>Try again?</button> "
        vastausalue.innerHTML = "";
    }
};


//API -haku
async function kysymyshaku(kierros) {
    const response = await fetch(`http://127.0.0.1:3000/${kierros}`);
    return response.json();
}

//Printataan nimikenttä ja aloitusnappi
vastausalue.innerHTML = "<form id='start_game'><input id='namebox' name='namebox' placeholder='Enter name...' type='text'><input type='submit' value='Start game'></form>";
const start_game = document.querySelector('#start_game');

//Lisätään aloitusnappiin async event listener
start_game.addEventListener('submit', async function(evt){
    evt.preventDefault();
    const player_name = document.querySelector('input[name=namebox]').value;
    game.init(player_name);
});

//Kun haluaa aloittaa pelin uudelleen
function refresh(){
        window.location.reload("Refresh")
}