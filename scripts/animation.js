// Book open animation

const bookAnimation = document.getElementById('book-animation');
const images = ['Assets/Book Animation/Book1.svg', 'Assets/Book Animation/Book2.svg', 'Assets/Book Animation/Book3.svg', 'Assets/Book Animation/Book4.svg', 'Assets/Book Animation/Book5.svg']; // Add your image paths here

let currentImageIndex = 0;

function animateBook() {
    if (currentImageIndex >= images.length) return;

    const img = new Image();
    img.src = images[currentImageIndex];
    img.onload = () => {
        bookAnimation.innerHTML = '';
        bookAnimation.style.height = img.height * (bookAnimation.offsetWidth / img.width) + 'px'; // Adjusting height
        bookAnimation.appendChild(img);
        if (currentImageIndex === 0) {
            img.addEventListener('click', () => {
                currentImageIndex++;
                animateBook();
            });
        } else {
            currentImageIndex++;
            setTimeout(animateBook, 500); // Adjust the time for each frame
        }
    };
}

window.onload = () => {
    currentImageIndex = 0;
    animateBook();
};