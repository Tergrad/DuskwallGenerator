let bookData; // Global declaration

// Helper function to get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}



// Generate Books Function

// Fetch JSON Data
fetch('Data/books.json')
    .then(response => response.json())
    .then(data => {
        bookData = data;
        
        // Initialize genre dropdown
        const genreSelector = document.getElementById('genreSelector');
        for (const genre in bookData) {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelector.appendChild(option);
        }

        // Enable the generate button
        document.getElementById('generateBtn').removeAttribute('disabled');
    })
    .catch(error => {
        console.error("Error fetching book data:", error);
    });


// Event Listener for Button
document.getElementById('generateBtn').addEventListener('click', function() {
    if (bookData) { // Check if bookData exists and is not undefined
        const selectedGenre = document.getElementById('genreSelector').value;
        const generatedBookTitle = generateBookName(selectedGenre);
        document.getElementById('book-card').innerText = generatedBookTitle;
    } else {
        console.warn("Book data is not loaded yet.");
    }
});




// Main function to generate book name
function generateBookName(genre) {
    if (!bookData || !bookData[genre]) {
        console.error("Book data not loaded yet or Invalid Genre");
        console.log("Generated Title:", title); // Add this line before returning
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
    const toggleHandle = document.getElementById('toggleHandle');
    
    if (toggleHandle) {
        toggleHandle.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('expanded');
        });
    } else {
        console.warn('Element with id "toggleHandle" not found');
    }
});


const categoryCards = document.querySelectorAll('#categoryCards .card');
const filterButton = document.getElementById('filterButton');
const generateSidebarBtn = document.getElementById('generateSidebarBtn');
const numItemsSlider = document.getElementById('numItemsSlider');
const numItemsDisplay = document.getElementById('numItemsDisplay');

// Handle category selection
categoryCards.forEach((card) => {
    card.addEventListener('click', function() {
        // Remove selected class from all cards
        categoryCards.forEach((c) => c.classList.remove('selected'));
        // Add selected class to clicked card
        this.classList.add('selected');
        
        // Check if the books category is selected
        if (this.dataset.category === "books") {
            const genreSelectionDiv = document.getElementById('genreSelection');
            genreSelectionDiv.innerHTML = ''; // Clear previous content
            genreSelectionDiv.classList.remove('collapsed'); // Show the genre selection
            
            // Populate genres
            for (const genre in bookData) {
                const genreButton = document.createElement('button');
                genreButton.textContent = genre;
                genreButton.addEventListener('click', function() {
                    // You can put your logic for handling genre selection here
                    const name = generateBookName(genre);
                    document.getElementById('book-card').innerText = name;
                });
                genreSelectionDiv.appendChild(genreButton);
            }
        }
    });
});


// Update number of items display
numItemsSlider.addEventListener('input', function () {
    numItemsDisplay.textContent = this.value;
});



// Handle generation from sidebar
generateSidebarBtn.addEventListener('click', function () {
    // Check if the books category is selected
    const bookCard = document.querySelector('#categoryCards .card[data-category="books"]');
    if (bookCard.classList.contains('selected')) {
        // Generate a random book without specifying the genre
        const genre = getRandomItem(Object.keys(bookData));
        const name = generateBookName(genre);
        // Display the generated book name (you can update this to your desired location)
        document.getElementById('book-card').innerText = name;
    }
    // You can add logic for other categories here
});


