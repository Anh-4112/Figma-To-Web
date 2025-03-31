// =============================================================================
// ==============================    SLIDESHOW    ==============================
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
    const slideshow = document.querySelector(".slideshow");
    const slideshowDots = document.querySelector(".slideshow-dots");
    const btnSlideshowPrev = document.querySelector(".btn-slideshow-prev");
    const btnSlideshowNext = document.querySelector(".btn-slideshow-next");
    if (!slideshow) return; // Nếu không tìm thấy slideshow, thoát sớm

    // Tạo 1 mảng có chứa các phần tử là slide của slideshow
    const slides = Array.from(slideshow.querySelectorAll(".slide"));
    if (slides.length === 0) return; // Nếu không có slide nào, thoát sớm

    // Lấy chiều rộng của một slide để tính toán vị trí di chuyển
    let slideWidth = slides[0].offsetWidth;
    
    // Biến kiểm soát trạng thái kéo slide
    let isDragging = false, // Đang kéo hay không
        startX = 0, // Vị trí bắt đầu kéo (trục X)
        deltaX = 0, // Khoảng cách kéo (trục X)
        currentIndex = 0; // Chỉ mục slide hiện tại

    // Biến kiểm soát ngăn chặn click
    let clickPrevented = false;

    // Tạo dots tự động theo số lượng slides
    slides.forEach((_, i) => {
        const dot = document.createElement("span"); // Tạo phần tử dot
        dot.classList.add("dot"); // Thêm class "dot" để tạo kiểu
        dot.dataset.index = i; // Gán chỉ số slide tương ứng cho dot
        slideshowDots.appendChild(dot); // Thêm dot vào container
    });
    
    // Lấy danh sách các dots vừa tạo
    const dots = Array.from(slideshowDots.querySelectorAll(".dot"));

    // Hàm cập nhật trạng thái active cho dot tương ứng với slide hiện tại
    const updateActiveDot = () => {
        dots.forEach(dot => dot.classList.remove("active")); // Xóa class active khỏi tất cả dots
        dots[currentIndex].classList.add("active"); // Thêm class active vào dot của slide hiện tại
    };
    
    // Cập nhật kích thước slide khi thay đổi kích thước cửa sổ
    const updateSizes = () => {
        slideWidth = slides[0].offsetWidth; // Lấy lại chiều rộng slide mới
        goToSlide(currentIndex, false); // Căn chỉnh lại vị trí slide hiện tại
    };
    window.addEventListener("resize", updateSizes);

    // Ngăn chặn kéo link khi đang kéo slide
    slideshow.addEventListener("mousedown", (e) => {
        isDragging = false;
        clickPrevented = false; // Reset trạng thái chặn click
        startX = e.pageX;
        deltaX = 0;
        e.preventDefault(); // Chặn hành vi mặc định của trình duyệt
    });

    slideshow.addEventListener("mousemove", (e) => {
        if (e.buttons !== 1) return; // Kiểm tra có giữ chuột không
        isDragging = true;
        const x = e.pageX;
        deltaX = x - startX;
    });

    slideshow.addEventListener("mouseup", () => {
        if (isDragging) {
            clickPrevented = true;
        }
        setTimeout(() => {
            clickPrevented = false;
        }, 100);
    });

    // Chặn click vào link nếu vừa kéo
    slideshow.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", (e) => {
            if (clickPrevented) {
                e.preventDefault();
                e.stopImmediatePropagation();
            } else {
                window.location.href = a.href; // Điều hướng trang nếu không bị chặn
            }
        });
    });
    
    // Hàm di chuyển đến slide nhất định
    const goToSlide = (index, smooth = true) => {
        if (!slideshow) return;
        slideshow.style.transition = smooth ? "" : "none";
        slideshow.style.transform = `translateX(${-index * 100}%)`;
        currentIndex = index;
        updateActiveDot();
    };

    // Bắt đầu kéo slide
    const dragStart = (e) => {
        isDragging = true;
        startX = e.touches ? e.touches[0].pageX : e.pageX;
        deltaX = 0;
        slideshow.style.transition = "none";
    };

    // Xử lý khi đang kéo
    const dragging = (e) => {
        if (!isDragging) return;
        
        let x = e.touches ? e.touches[0].pageX : e.pageX;
        deltaX = x - startX;
        
        // Ngăn trình duyệt cuộn trang khi kéo slide
        e.preventDefault();
    
        const percentage = (-currentIndex * 100) + (deltaX / slideWidth) * 100;
        slideshow.style.transform = `translateX(${percentage}%)`;
    };

    // Dừng kéo và xác định slide nào cần hiển thị
    const dragStop = () => {
        if (!isDragging) return;
        isDragging = false;
    
        const threshold = slideWidth * 0.1; // Nếu kéo quá 10% thì chuyển slide
        if (Math.abs(deltaX) > threshold) {
            currentIndex = deltaX < 0
                ? Math.min(currentIndex + 1, slides.length - 1)
                : Math.max(currentIndex - 1, 0);
        }
    
        goToSlide(currentIndex, true);
    };

    // Lắng nghe sự kiện chuột
    slideshow.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    slideshow.addEventListener("mouseleave", dragStop);

    // Lắng nghe sự kiện cảm ứng trên màn hình
    slideshow.addEventListener("touchstart", dragStart, { passive: false });
    slideshow.addEventListener("touchmove", dragging, { passive: false });
    slideshow.addEventListener("touchend", dragStop);

    // Sự kiện click vào prev
    btnSlideshowPrev.addEventListener("click", () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        goToSlide(currentIndex, true);
    });

    // Sự kiện click vào next
    btnSlideshowNext.addEventListener("click", () => {
        currentIndex = Math.min(currentIndex + 1, slides.length - 1);
        goToSlide(currentIndex, true);
    });
    
    // Sự kiện click vào dot
    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.getAttribute("data-index"));
            goToSlide(index, true);
        });
    });

    // Căn chỉnh slide ngay khi load
    goToSlide(currentIndex, false);
});