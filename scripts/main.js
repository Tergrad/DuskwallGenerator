//  Sidebar: Listen for click on toggle Sidebar button; Check if 'quickGencontent' div is displayed; If hidden or net set
//           it will show, if it's shown, it will hide it.
document.getElementById('toggleHandle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('expanded')) {
        sidebar.classList.remove('expanded');
    } else {
        sidebar.classList.add('expanded');
    }
});


// Handle button click of Quick random generation Button
document.getElementById('generateRandom').addEventListener('click', function() {
    const randomNumber = Math.floor(Math.random() * 100); // Generates a random number between 0-99
    document.getElementById('randomResult').innerText = randomNumber;
});




//  HTML to Function Link

document.getElementById('booksCard').addEventListener('click', function() {
    const cardContent = this.querySelector('.cardContent');
    if (cardContent.style.display === "none" || cardContent.style.display === "") {
        cardContent.style.display = "block";

        // Populate content (This is a simple example, you can enhance this)
        let contentHtml = "<strong>Types:</strong><br>";
        booksData.types.forEach(type => {
            contentHtml += `<span>${type}</span><br>`;
        });
        contentHtml += "<strong>Eras:</strong><br>";
        booksData.eras.forEach(era => {
            contentHtml += `<span>${era}</span><br>`;
        });
        cardContent.innerHTML = contentHtml;

    } else {
        cardContent.style.display = "none";
    }
});




// Fetch the book data from the JSON file

let bookData;

fetch('Data/books.json')
    .then(response => response.json())
    .then(data => {
        bookData = data;
    })
    .catch(error => console.error('Error fetching the JSON data:', error));

    function populateGenresDropdown() {
        const genreSelector = document.getElementById('genreSelector');
        
        for (const genre in bookData) {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelector.appendChild(option);
        }
    }


function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateBookName(genre) {
    if (!bookData || !bookData[genre]) {
        console.error("Book data not loaded yet or Invalid Genre");
        return;
    }

    const genreData = bookData[genre];
    const template = getRandomItem(genreData.templates);
    let title = template;

    for (const placeholder in genreData.placeholders) {
        while (title.includes(`[${placeholder}]`)) {
            let replacement;

            if (genre === "WissenschaftlicheBucher" && (placeholder === "Substantive" || placeholder === "Adjektive")) {
                const discipline = getRandomItem(genreData.placeholders["Disziplin"]);
                replacement = getRandomItem(genreData.placeholders[placeholder][discipline] || genreData.placeholders[placeholder].default);
            } else {
                replacement = getRandomItem(genreData.placeholders[placeholder]);
            }

            title = title.replace(`[${placeholder}]`, replacement);
        }
    }
    return title;
}

<button onclick="showGeneratedBookName()" id="generateBtn">Generate Book Name</button>




function showGeneratedBookName() {
    const genre = document.getElementById('genreSelector').value;
    const name = generateBookName(genre);
    document.getElementById('generatedName').innerText = name;
}