// ==============================================================================
// ================= SLIDESHOW ==================================================
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
    const slideshow = document.querySelector(".slideshow");
    if (!slideshow) return; // Nếu không tìm thấy slideshow, thoát sớm

    const slides = Array.from(slideshow.querySelectorAll(".slide"));
    if (slides.length === 0) return; // Nếu không có slide nào, thoát sớm

    let slideWidth = slides[0].offsetWidth;
    let isDragging = false, startX = 0, deltaX = 0, currentIndex = 0;

    // Cập nhật kích thước slide khi thay đổi kích thước cửa sổ
    const updateSizes = () => {
        slideWidth = slides[0].offsetWidth; // Lấy lại chiều rộng slide mới
        goToSlide(currentIndex, false); // Căn chỉnh lại vị trí slide hiện tại
    };
    window.addEventListener("resize", updateSizes);

    // Ngăn chặn kéo link trong slideshow khi đang kéo slide
    slideshow.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", (e) => { if (isDragging) e.preventDefault(); });
        a.addEventListener("dragstart", (e) => e.preventDefault());
    });

    // Hàm di chuyển đến slide nhất định
    const goToSlide = (index, smooth = true) => {
        if (!slideshow) return; // Tránh lỗi nếu slideshow chưa được khởi tạo
        slideshow.style.transition = smooth ? "" : "none";
        slideshow.style.transform = `translateX(${-index * 100}%)`;
    };

    // Bắt đầu kéo slide
    const dragStart = (e) => {
        isDragging = true;
        startX = e.pageX || e.touches[0].pageX; // Xác định vị trí bắt đầu kéo
        deltaX = 0;
        slideshow.style.transition = "none"; // Tắt animation khi đang kéo
    };

    // Xử lý khi đang kéo
    const dragging = (e) => {
        if (!isDragging) return;
        const x = e.pageX || e.touches[0].pageX; // Lấy vị trí hiện tại của con trỏ hoặc ngón tay
        deltaX = x - startX;
        const percentage = (-currentIndex * 100) + (deltaX / slideWidth) * 100;
        slideshow.style.transform = `translateX(${percentage}%)`;
    };

    // Dừng kéo và xác định slide nào cần hiển thị
    const dragStop = () => {
        if (!isDragging) return;
        isDragging = false;

        // Nếu kéo quá 10% chiều rộng slide, chuyển slide
        const threshold = slideWidth * 0.1;
        if (Math.abs(deltaX) > threshold) {
            currentIndex = deltaX < 0 
                ? Math.min(currentIndex + 1, slides.length - 1) // Sang phải
                : Math.max(currentIndex - 1, 0); // Sang trái
        }

        goToSlide(currentIndex, true);
    };

    // Lắng nghe sự kiện chuột
    slideshow.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    slideshow.addEventListener("mouseleave", dragStop);

    // Lắng nghe sự kiện cảm ứng trên màn hình
    slideshow.addEventListener("touchstart", dragStart);
    slideshow.addEventListener("touchmove", dragging, { passive: false });
    slideshow.addEventListener("touchend", dragStop);

    // Căn chỉnh slide ngay khi load
    goToSlide(currentIndex, false);
});