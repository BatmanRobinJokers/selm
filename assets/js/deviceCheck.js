function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

// If on a mobile device, redirect to Facebook.com
if (isMobile()) {
    window.location.href = "http://www.matrix.con";
}
