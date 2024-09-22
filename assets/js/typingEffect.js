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

    const aboutText = "It is not about what I can do. - \"Vi veri universum vivus vici\"";
    typingEffect(aboutText, "about-description", 33); // Speed can be adjusted
});
