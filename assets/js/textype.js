document.addEventListener("DOMContentLoaded", function () {
    const typingEffect = (text, elementId, speed) => {
        const element = document.getElementById(elementId);
        let index = 0;
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        type();
    };

    // Define the text for the #about section
    const aboutText = "The SELM model combines cutting-edge techniques to enhance summarization and knowledge management. With a focus on scalable solutions, it integrates GNNs, optimized transformers, and dynamic inference mechanisms. - \"Vi veri universum vivus vici\"";
    typingEffect(aboutText, "about-description", 100); // Speed can be adjusted

    // Modal functionality
    const openModalLinks = document.querySelectorAll('.open-modal');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    openModalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            document.getElementById(modalId).style.display = "block";
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = "none";
        });
    });

    // Close modal if clicking outside of the modal content
    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });
});
