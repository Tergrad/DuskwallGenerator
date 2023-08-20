// Helper function to get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}



// Generate Books Function


// Fetch JSON data
let bookData = {};

fetch('Data/books.json')
    .then(response => response.json())
    .then(data => {
        bookData = data;
        initialize();
    })
    .catch(error => {
        console.error("Error fetching book data:", error);
    });

// This function initializes your application after the data has been loaded
function initialize() {
    // Populate genre dropdown
    const genreSelector = document.getElementById('genreSelector');
    for (const genre in bookData) {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreSelector.appendChild(option);
    }

    // Handle book name generation
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.addEventListener('click', function() {
        const genre = genreSelector.value;
        const name = generateBookName(genre);
        document.getElementById('generatedName').innerText = name;
    });
}


// Main function to generate book name
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

            // Special probability logic for Präfixe and Suffixe
            if (placeholder === "Präfix" || placeholder === "Suffix") {
                if (Math.random() > 0.7) {
                    replacement = getRandomItem(genreData.placeholders[placeholder]);
                } else {
                    // Handle potential surrounding hyphens when removing the placeholder
                    const regex = new RegExp(`-?\\[${placeholder}\\]-?`, 'g');
                    title = title.replace(regex, "");
                    continue;
                }
            } 
            // Handle Substantiv and Adjektiv for WissenschaftlicheBucher genre
            else if (genre === "WissenschaftlicheBucher" && (placeholder === "Substantiv" || placeholder === "Adjektiv")) {
                const discipline = getRandomItem(genreData.placeholders["Disziplin"]);
                replacement = getRandomItem(genreData.placeholders[placeholder][discipline]);
            } 
            // Default case
            else {
                replacement = getRandomItem(genreData.placeholders[placeholder]);
            }

            title = title.replace(`[${placeholder}]`, replacement);
        }
    }
    return title;
}


// Event listeners and other setup logic for books
document.addEventListener("DOMContentLoaded", function() {
    // Populate genre dropdown
    const genreSelector = document.getElementById('genreSelector');
    for (const genre in bookData) {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreSelector.appendChild(option);
    }

    // Handle book name generation
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.addEventListener('click', function() {
        const genre = genreSelector.value;
        const name = generateBookName(genre);
        document.getElementById('generatedName').innerText = name;
    });
});
