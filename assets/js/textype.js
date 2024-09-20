document.addEventListener("DOMContentLoaded", function () {
    const typingEffect = (element) => {
        const text = element.textContent;
        element.textContent = ''; // Clear the text initially
        let index = 0;

        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100); // Adjust speed of typing effect here (in milliseconds)
            }
        };

        type();
    };

    // Select all <p> elements within the specific section (id="setup")
    const paragraphs = document.querySelectorAll("#setup p");
    paragraphs.forEach(paragraph => {
        typingEffect(paragraph);
    });
});
