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

    const aboutText = "The SELM model combines cutting-edge techniques to enhance summarization and knowledge management. With a focus on scalable solutions, it integrates GNNs, optimized transformers, and dynamic inference mechanisms. - \"Vi veri universum vivus vici\"";
    typingEffect(aboutText, "about-description", 50); // Speed can be adjusted
});
