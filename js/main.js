let slideIndex = 1;
let slideTimer; // Biến lưu timer
showSlides(slideIndex);

function startAutoSlide() {
    // Khởi động lại bộ đếm thời gian tự động chuyển ảnh
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
        plusSlides(1);
    }, 5000);
}

startAutoSlide(); // Khởi động tự động chuyển ảnh lần đầu

function plusSlides(n) {
    showSlides(slideIndex += n);
    startAutoSlide(); // Reset thời gian tự động chuyển ảnh khi người dùng click
}

function currentSlide(n) {
    showSlides(slideIndex = n);
    startAutoSlide(); // Reset thời gian tự động chuyển ảnh khi người dùng chọn dot
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slider__img");
    let dots = document.getElementsByClassName("slider__dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}