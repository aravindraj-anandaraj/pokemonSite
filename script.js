let search_input = document.getElementById('search-input');
let img = document.getElementById('img');
let img_container = document.getElementById('img-container');
let pokedox_card = document.querySelector('#pokedox-container .row');
let select = document.getElementById('items');
let previous_button = document.getElementById('previous-button');
let next_button = document.getElementById('next-button');
let start_page = document.getElementById('start-page');
let end_page = document.getElementById('end-page');
let addOption = document.getElementById('category-list');
let start_page_number = 1;
var next;
var previous;

let API_URL = "https://pokeapi.co/api/v2";
let endPoint = search_input.selectedOptions[0].value;


window.onload = function() {
    displayPokemon(`${API_URL}/${endPoint}/?offset=0&limit=${select.selectedOptions[0].value}`);
}

let displayPokemon = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    end_page.innerHTML = Math.round(data.count / select.selectedOptions[0].value);
    start_page.innerHTML = start_page_number;
    if(previous !== 'null') {
        previous = data.previous;
    }
    if(next !== 'null') {
        next = data.next;
    }
    if(endPoint === 'type') {
        await getPrompt();
    }
    data.results.forEach(async (pokeArray) => {
        addOptions(pokeArray.name);
        if(endPoint === 'pokemon') {
            try {
                const pokemon_url = await fetch(pokeArray.url);
                const pokemon_data = await pokemon_url.json();
                getPokemon(pokemon_data);
            } catch(err) {
                console.log(err);
            }
        }
        if(endPoint === 'type') {
            const pokemon_url = await fetch(pokeArray.url);
            const pokemon_data = await pokemon_url.json();
            const pokemonArray = pokemon_data.pokemon;
            for(let i=0; i<3; i++) {
                const url = await pokemonArray[i].pokemon.url;
                try {
                    const poke = await fetch(url);
                    const poke_data = await poke.json();
                    getPokemon(poke_data);
                } catch(err) {
                    console.log(err);
                }
            }
        }
    })
}

async function getPrompt() {
    pokedox_card.innerHTML = pokedox_card.innerHTML + `
    <div class="container-fluid d-flex justify-content-center my-5 align-self-center">
        <label class="mx-2">Select the type that you want to search from the list below :</label>
        <select class="mx-2" name="" id="category-list">
            <option value="pokemon" selected>All</option>
        </select>
    </div>`;
}

async function addOptions(value) {
    let option = document.createElement('option');
    option.innerHTML = value;
    addOption.appendChild(option);
}

function getPokemon(pokemon_data) {
    pokedox_card.innerHTML = pokedox_card.innerHTML + `
    <div class="col-sm-6 col-md-4 col-lg-3 card-deck">
        <div class="card text-center">
            <div class="card-body text-center m-3 p-2">
                <h4 class="card-title">${pokemon_data.name.toUpperCase()}</h4>
            </div>
            <img src="${pokemon_data.sprites.other.dream_world.front_default}" class="card-img p-3" alt="${pokemon_data.name}">
            <div class="card-footer text-center m-3 p-2 bg-white">
                <h5 id="${pokemon_data.id}" class="mb-3">Details</h5>
            </div>
            <p>Weight : ${pokemon_data.weight}</p>
            <p>Abilities : ${pokemon_data.abilities[0].ability.name}</p>
            <p>Moves : ${pokemon_data.moves[0].move.name}</p>
        </div>
    </div>`;
}

function displayPokeball() {
    img.src = 'https://wallpaperaccess.com/full/45649.png';
    img_container.style.backgroundColor = '#383838';
}

img.addEventListener('click', () => {
    img.src = 'https://cdn.vox-cdn.com/thumbor/e4KRzS--UsuixA2G8TOCwJ-O024=/1400x1050/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/6839749/pokemon.0.png';
    img_container.style.backgroundColor = '#f9e1dd';
})

search_input.addEventListener('change', () => {
    endPoint = search_input.selectedOptions[0].value;
    start_page_number = 1;
    pokedox_card.innerHTML = '';
    if(endPoint === 'pokemon') {
        displayPokemon(`${API_URL}/${endPoint}/?offset=0&limit=${select.selectedOptions[0].value}`);
    } else if (endPoint === 'type') {
        displayPokemon(`${API_URL}/${endPoint}`);
    }
    previous_button.disabled = false;
    next_button.disabled = false;
});

select.addEventListener('change', () => {
    start_page_number = 1;
    pokedox_card.innerHTML = '';
    displayPokemon(`${API_URL}/${endPoint}/?offset=0&limit=${select.selectedOptions[0].value}`);
})

function paginateNext() {
    if(next !== null) {
        pokedox_card.innerHTML = '';
        start_page_number++;
        displayPokemon(next);
        previous_button.disabled = false;
    } else {
        next_button.disabled = true;
    }
}

function paginatePrevious() {
    if(previous !== null) {
        pokedox_card.innerHTML = '';
        start_page_number--;
        displayPokemon(previous);
        next_button.disabled = false;
    } else {
        previous_button.disabled = true;
    }
}