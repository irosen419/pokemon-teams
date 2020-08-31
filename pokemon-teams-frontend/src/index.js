const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const fetchTrainers = () => {
    fetch(TRAINERS_URL)
        .then(resp => resp.json())
        .then(renderTrainerCards)
}

const renderTrainerCards = trainers => {
    let main = document.querySelector('main')
    for (const trainer of trainers) {
        const trainerCard = document.createElement('div')
        trainerCard.className = "card"
        trainerCard.dataset.id = trainer.id

        trainerCard.innerHTML = `
        <p>${trainer.name}</p>
        <button class="add-btn" data-trainer-id="${trainer.id}">Add Pokemon</button>
        <ul></ul>
        `
        main.append(trainerCard)

        for (let pokemon of trainer.pokemons) {
            addPokemon(pokemon, trainerCard)
        }
    }
}

const addPokemon = (pokemon, trainerCard) => {
    trainerCard.insertAdjacentHTML('beforeend',
        `<li id="${pokemon.id}">${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`)
}

document.addEventListener('click', e => {
    if (e.target.matches('button.add-btn')) {
        const button = e.target
        const trainerCard = button.parentElement
        let pokemonListNum = trainerCard.querySelectorAll('li').length
        if (pokemonListNum < 6) {
            postPokemon(button.dataset.trainerId, trainerCard)
        }
    } else if (e.target.matches('button.release')) {
        const button = e.target
        const pokeLi = button.parentElement
        releasePokemon(pokeLi)
    }
})

const postPokemon = (trainerId, trainerCard) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "trainer_id": trainerId
        })
    }

    fetch(POKEMONS_URL, options)
        .then(resp => resp.json())
        .then(pokemon => addPokemon(pokemon, trainerCard))
        .catch(console.log)
}


const releasePokemon = (pokemon) => {
    let pokeId = pokemon.id
    let options = {
        method: 'DELETE'
    }
    fetch(POKEMONS_URL + `/${pokeId}`, options)
        .then(response => response.json())
        .then(pokemon.remove())

}

fetchTrainers()