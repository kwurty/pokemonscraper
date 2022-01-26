const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://bulbapedia.bulbagarden.net/wiki/List_of_Japanese_Pok%C3%A9mon_names';

async function getPokemonNames() {
    // grab page content
    const { data: html } = await axios.get(URL);

    // load content into Cheerio
    const $ = cheerio.load(html);

    // get the tables
    const tables = $('table');

    // init the pokemon array
    const pokemons = [];

    $('table').each((index, element) => {
        // only need the first 7 tables, so return if over that
        if (index > 7) return;

        // find the tables
        const $table = $(element);

        // grab the rows from the table
        const $rows = $table.find('tr');
        // for each row
        $rows.each((rowIndex, rowElement) => {
            if (rowIndex < 2) return;
            const $row = $(rowElement)
            const $cols = $row.find('td');

            // write pokemon info
            const pokemon = {
                number: $($cols[0]).text().trim(),
                name: $($cols[2]).text().trim(),
                kana: $($cols[3]).text().trim(),
                hepburn: $($cols[4]).text().trim(),
                trademark: $($cols[5]).text().trim(),
                imageUrl: $($cols[1]).find('img').attr('src')

            }
            pokemons.push(pokemon);
        })
    })
    console.log(pokemons);

    fs.writeFileSync('pokemons.json', JSON.stringify(pokemons, null, 2), 'utf8');
}

getPokemonNames();