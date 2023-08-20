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

let bookData = {};


// Fetch the book data from the JSON file
fetch('Data/books.json')
    .then(response => response.json())
    .then(data => {
        bookData = data;
        document.getElementById("generateBtn").disabled = false; // Enable the button here
    })
    .catch(error => {
        console.error("Error fetching the book data:", error);
    });



function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateBookName(genre) {
    if (!bookData) {
        console.error("Book data not loaded yet");
        return;
    }

    const genreData = bookData[genre];
    if (!genreData) return "Invalid Genre";

    const template = getRandomItem(genreData.templates);
    let title = template;

    for (const placeholder in genreData.placeholders) {
        while (title.includes(`[${placeholder}]`)) {
            let replacement;
            if (genre === "WissenschaftlicheBucher" && placeholder === "Adjektive") {
                const discipline = getRandomItem(Object.keys(genreData.placeholders["Substantive"])); // Assuming disciplines are the keys
                replacement = getRandomItem(genreData.placeholders["Substantive"][discipline]);
                title = title.replace(`[Substantive]`, replacement);
                replacement = getRandomItem(genreData.placeholders["Adjektive"][discipline] || genreData.placeholders["Adjektive"].default);
            } else if (typeof genreData.placeholders[placeholder] === "object" && genreData.placeholders[placeholder].default) {
                replacement = getRandomItem(genreData.placeholders[placeholder].default);
            } else {
                replacement = getRandomItem(genreData.placeholders[placeholder]);
            }
            title = title.replace(`[${placeholder}]`, replacement);
        }
    }
    return title;
}


function showGeneratedBookName() {
    const genre = document.getElementById('genreSelector').value;
    const name = generateBookName(genre);
    document.getElementById('generatedName').innerText = name;
}


