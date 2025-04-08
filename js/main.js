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

// =============================================================================
// ==============================    SLIDER OFFER    ===========================
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".wrapper-slider-offer").forEach(wrapper => {
        const carousel = wrapper.querySelector(".slider-offer");
        const btnPrev = wrapper.querySelector(".btn-offer-prev");
        const btnNext = wrapper.querySelector(".btn-offer-next");
        const firstCard = carousel.querySelector(".card-offer");

        let firstCardWidth = firstCard ? firstCard.offsetWidth : 0;
        let gap = parseInt(getComputedStyle(carousel).gap) || 0;
        let isDragging = false, startX, startScrollLeft, moved = false;

        const updateSizes = () => {
            firstCardWidth = firstCard ? firstCard.offsetWidth : 0;
            gap = parseInt(getComputedStyle(carousel).gap) || 0;
        };
        window.addEventListener("resize", updateSizes);

        // Ngăn kéo link
        wrapper.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", (e) => { if (moved) e.preventDefault(); });
            a.addEventListener("dragstart", (e) => e.preventDefault());
        });

        const dragStart = (e) => {
            isDragging = true;
            moved = false;
            startX = e.pageX || e.touches[0].pageX;
            startScrollLeft = carousel.scrollLeft;
            carousel.classList.add("dragging");
        };

        const dragging = (e) => {
            if (!isDragging) return;
            moved = true;
            const x = e.pageX || e.touches[0].pageX;
            carousel.scrollLeft = startScrollLeft - (x - startX);
        };

        const dragStop = () => {
            isDragging = false;
            carousel.classList.remove("dragging");
            if (moved) {
                const cardWidthWithGap = firstCardWidth + gap;
                const scrollLeft = carousel.scrollLeft;
                const closestIndex = Math.round(scrollLeft / cardWidthWithGap);
                const newScrollPosition = closestIndex * cardWidthWithGap;
                carousel.style.scrollBehavior = "smooth";
                carousel.scrollTo({ left: newScrollPosition, behavior: "smooth" });
                setTimeout(() => carousel.style.scrollBehavior = "auto", 500);
            }
        };

        const scrollToItem = (direction) => {
            const scrollLeft = carousel.scrollLeft;
            const cardWidthWithGap = firstCardWidth + gap;
            const currentIndex = Math.round(scrollLeft / cardWidthWithGap);
            const newIndex = direction === "prev"
                ? Math.max(0, currentIndex - 1)
                : Math.min(Math.ceil(carousel.scrollWidth / cardWidthWithGap), currentIndex + 1);

            const newScrollPosition = newIndex * cardWidthWithGap;
            carousel.style.scrollBehavior = "smooth";
            carousel.scrollTo({ left: newScrollPosition, behavior: "smooth" });
            setTimeout(() => carousel.style.scrollBehavior = "auto", 500);
        };

        btnPrev.addEventListener("click", () => scrollToItem("prev"));
        btnNext.addEventListener("click", () => scrollToItem("next"));

        // Gán sự kiện kéo chuột/cảm ứng
        carousel.addEventListener("mousedown", dragStart);
        carousel.addEventListener("mousemove", dragging);
        document.addEventListener("mouseup", dragStop);
        carousel.addEventListener("mouseleave", dragStop);
        carousel.addEventListener("touchstart", dragStart);
        carousel.addEventListener("touchmove", dragging);
        carousel.addEventListener("touchend", dragStop);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".slider-offer-center");
    let cards = Array.from(carousel.querySelectorAll(".card-offer-center"));
    if (!carousel || cards.length === 0) return;

    // === 1. Clone slide đầu và cuối để tạo hiệu ứng vô hạn ===
    const cloneHead = cards.slice(0, 2).map(card => card.cloneNode(true));
    const cloneTail = cards.slice(-2).map(card => card.cloneNode(true));
    cloneHead.forEach(clone => carousel.appendChild(clone));
    cloneTail.reverse().forEach(clone => carousel.insertBefore(clone, cards[0]));
    cards = Array.from(carousel.querySelectorAll(".card-offer-center")); // Cập nhật danh sách slide sau khi clone

    // === 2. Thiết lập style cho carousel và slide ===
    carousel.style.overflowX = "hidden";
    carousel.style.scrollBehavior = "auto";
    carousel.style.scrollSnapType = "none";
    cards.forEach(card => card.style.flexShrink = "0"); // Ngăn co giãn slide

    // === 3. Khai báo các biến điều hướng ===
    const realStartIndex = 2; // Sau 2 clone cuối
    let currentIndex = realStartIndex;

    // === 4. Tính vị trí cuộn theo index slide ===
    const getScrollPositionForIndex = (index) => {
        return cards[index].offsetLeft - carousel.offsetLeft;
    };

    // === 5. Chờ tất cả ảnh trong carousel load xong mới scroll về vị trí ban đầu ===
    const waitForImagesToLoad = () => {
        const images = carousel.querySelectorAll("img");
        const promises = Array.from(images).map(img => {
            return img.complete
                ? Promise.resolve()
                : new Promise(resolve => img.addEventListener("load", resolve));
        });
        return Promise.all(promises);
    };

    waitForImagesToLoad().then(() => {
        requestAnimationFrame(() => {
            const target = cards[realStartIndex];
            if (target) {
                const scrollPos = target.offsetLeft - carousel.offsetLeft;
                carousel.scrollLeft = scrollPos;

                // Cập nhật chỉ số slide hiện tại chính xác hơn
                let total = 0;
                let index = 0;
                for (let i = 0; i < cards.length; i++) {
                    const style = window.getComputedStyle(cards[i]);
                    const width = cards[i].offsetWidth + (parseInt(style.marginRight) || 0);
                    if (scrollPos < total + width / 2) {
                        index = i;
                        break;
                    }
                    total += width;
                }
                currentIndex = index;
            }
            startAutoSlide();
        });
    });

    // === 6. Scroll đến slide theo index ===
    const scrollToIndex = (index, smooth = true) => {
        carousel.scrollTo({
            left: getScrollPositionForIndex(index),
            behavior: smooth ? "smooth" : "auto"
        });
    };

    // === 7. Tự động chuyển slide ===
    let autoSlideInterval = null;

    const startAutoSlide = () => {
        if (autoSlideInterval) return; // Đã chạy rồi thì không chạy lại
        autoSlideInterval = setInterval(() => {
            currentIndex++;
            scrollToIndex(currentIndex);

            if (currentIndex >= cards.length - 2) {
                // Khi đến slide clone cuối, nhảy ngược lại về realStartIndex
                setTimeout(() => {
                    currentIndex = realStartIndex;
                    scrollToIndex(currentIndex, false);
                }, 400);
            }
        }, 2500);
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    };

    const restartAutoSlide = () => {
        stopAutoSlide();
        startAutoSlide();
    };

    // === 8. Kéo tay bằng chuột hoặc cảm ứng ===
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    let moved = false;

    const dragStart = (e) => {
        isDragging = true;
        moved = false;
        startX = e.pageX || e.touches[0].pageX;
        scrollStart = carousel.scrollLeft;
        stopAutoSlide();
    };

    const dragMove = (e) => {
        if (!isDragging) return;
        moved = true;
        const x = e.pageX || e.touches[0].pageX;
        const delta = x - startX;
        carousel.scrollLeft = scrollStart - delta;
    };

    const dragEnd = () => {
        if (!isDragging) return;
        isDragging = false;

        // Tính lại slide gần nhất
        const scrollPos = carousel.scrollLeft;
        let total = 0;
        let index = 0;
        for (let i = 0; i < cards.length; i++) {
            const style = window.getComputedStyle(cards[i]);
            const width = cards[i].offsetWidth + (parseInt(style.marginRight) || 0);
            if (scrollPos < total + width / 2) {
                index = i;
                break;
            }
            total += width;
        }

        currentIndex = index;
        scrollToIndex(currentIndex);

        // Nếu kéo về slide clone => reset về slide thật
        setTimeout(() => {
            if (currentIndex <= 1) {
                currentIndex = cards.length - 4;
                scrollToIndex(currentIndex, false);
            } else if (currentIndex >= cards.length - 2) {
                currentIndex = realStartIndex;
                scrollToIndex(currentIndex, false);
            }
        }, 400);

        restartAutoSlide();
    };

    // === 9. Ngăn click khi đang kéo ===
    carousel.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", (e) => {
            if (moved) e.preventDefault();
        });
        a.addEventListener("dragstart", (e) => e.preventDefault());
    });

    // === 10. Sự kiện chuột và cảm ứng ===
    carousel.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);

    carousel.addEventListener("touchstart", dragStart);
    carousel.addEventListener("touchmove", dragMove);
    carousel.addEventListener("touchend", dragEnd);

    // === 11. Tạm dừng khi hover vào, chạy lại khi rời chuột ===
    carousel.addEventListener("mouseenter", stopAutoSlide);
    carousel.addEventListener("mouseleave", restartAutoSlide);

    // === 12. Tự canh chỉnh lại vị trí khi resize ===
    window.addEventListener("resize", () => {
        scrollToIndex(currentIndex, false);
    });

    // === 13. Đảm bảo khởi tạo scroll đúng vị trí ban đầu ===
    requestAnimationFrame(() => {
        const target = cards[realStartIndex];
        if (target) {
            carousel.scrollLeft = target.offsetLeft;
        }
    });
});

// =============================================================================
// ==============================    LIST FOOTER    ============================
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Chọn tất cả phần tử có class "footer-list" (các menu con trong footer)
    document.querySelectorAll(".footer-list").forEach(menu => {
        // Lấy biểu tượng (+/-) từ phần tử liền trước menu
        let icon = menu.previousElementSibling.querySelector(".footer-icon");
        // Kiểm tra xem menu có mở sẵn hay không dựa vào biểu tượng (+/-)
        let isOpen = icon.textContent.trim() === "−";

        if (isOpen) {
            // Nếu biểu tượng là "-", mở sẵn menu với chiều cao thực tế
            requestAnimationFrame(() => {
                menu.style.maxHeight = menu.scrollHeight / 10 + "rem";
            });
        } else {
            // Nếu biểu tượng là "+", giữ menu đóng với maxHeight = 0
            menu.style.maxHeight = "0rem";
        }
        // Lưu trạng thái mở/đóng của menu vào thuộc tính dataset
        menu.dataset.open = isOpen;
    });
});
// Hàm xử lý khi người dùng nhấn vào menu để mở hoặc đóng
function toggleMenu(id) {
    // Lấy menu theo ID
    let menu = document.getElementById(id);
    // Lấy biểu tượng (+/-) từ phần tử liền trước menu
    let icon = menu.previousElementSibling.querySelector(".footer-icon");
    // Kiểm tra trạng thái hiện tại của menu
    let isOpen = menu.dataset.open === "true";

    // Nếu menu đang mở, thu gọn lại, nếu đang đóng, mở rộng ra
    menu.style.maxHeight = isOpen ? "0rem" : menu.scrollHeight / 10 + "rem";
    // Cập nhật biểu tượng tương ứng
    icon.textContent = isOpen ? "+" : "−";
    // Cập nhật trạng thái mới vào dataset
    menu.dataset.open = !isOpen;
}

// =============================================================================
// ==============================    MINI CART    ==============================
// =============================================================================
document.addEventListener("DOMContentLoaded", function () {
    // ==== LẤY THAM CHIẾU CÁC PHẦN TỬ DOM SẼ SỬ DỤNG TRONG CODE ====
    const cartIcon = document.getElementById("cartIcon"); // Icon giỏ hàng (ở header)
    const cartBlock = document.getElementById("cartBlock"); // Khối giỏ hàng (slide bên phải)
    const closeCart = document.getElementById("closeCart"); // Nút đóng giỏ hàng
    const overlayCart = document.getElementById("overlayCart"); // Overlay mờ nền khi giỏ hàng mở
    const cartItemsContainer = document.getElementById("cartItemList"); // Danh sách sản phẩm trong giỏ
    const cartTotal = document.querySelectorAll(".cart-total"); // Tổng tiền, có thể ở nhiều chỗ (icon và footer)
    const addToCartButtons = document.querySelectorAll(".add-to-cart"); // Các nút "Add to cart" cho từng sản phẩm
    const cartItemTemplate = document.getElementById("cartItem"); // Template hiển thị 1 sản phẩm trong giỏ
    const cartCount = document.getElementById("cartCount"); // Phần tử hiển thị tổng số lượng sản phẩm ở icon

    // ==== LẤY GIỎ HÀNG TỪ localStorage (nếu có), KHÔNG CÓ THÌ TẠO MỚI ====
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // ==== XỬ LÝ MỞ GIỎ HÀNG ====
    cartIcon.addEventListener("click", () => toggleCart(true)); // Nhấn icon mở giỏ
    window.toggleCart = function (isOpen) {
        cartBlock.classList.toggle("open", isOpen); // Thêm/lấy class 'open' để mở/đóng block giỏ
        overlayCart.classList.toggle("show", isOpen); // Thêm/lấy class 'show' cho overlay nền
    };

    // ==== XỬ LÝ ĐÓNG GIỎ HÀNG ====
    const closeCartWithAnimation = () => toggleCart(false);
    closeCart.addEventListener("click", closeCartWithAnimation); // Nhấn "X" để đóng
    overlayCart.addEventListener("click", closeCartWithAnimation); // Nhấn nền mờ để đóng

    // ==== THÊM SẢN PHẨM VÀO GIỎ ====
    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Lấy phần tử chứa thông tin sản phẩm đang click
            const productBlock = button.closest(".wrapper");
            if (!productBlock) return;

            // Lấy thông tin hình ảnh, tên và giá từ các phần tử con
            const imageEl = productBlock.querySelector(".img");
            const nameEl = productBlock.querySelector(".item-name");
            const priceEl = productBlock.querySelector(".item-price");
            if (!imageEl || !nameEl || !priceEl) return;

            // Dữ liệu cụ thể
            const name = nameEl.textContent.trim(); // Tên sản phẩm
            const price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')); // Giá số
            const image = imageEl.src; // Link ảnh
            const id = button.dataset.id || `${name.replace(/\s+/g, "-").toLowerCase()}-${price}-${image.split('/').pop()}`; // Tạo id duy nhất

            // Thêm sản phẩm vào giỏ
            addToCart(id, name, price, image);
        });
    });

    // ==== HÀM THÊM VÀO GIỎ HÀNG ====
    function addToCart(id, name, price, image) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1; // Nếu đã có sản phẩm thì tăng số lượng
        } else {
            cart.push({ id, name, price, image, quantity: 1 }); // Thêm mới sản phẩm
        }

        saveCart();     // Lưu vào localStorage
        renderCart();   // Cập nhật giao diện giỏ
        toggleCart(true); // Mở giỏ hàng
    }

    // ==== HIỂN THỊ GIỎ HÀNG ====
    function renderCart() {
        // Xóa các sản phẩm cũ khỏi DOM (giữ lại template)
        Array.from(cartItemsContainer.children).forEach(child => {
            if (child.tagName !== "TEMPLATE") {
                cartItemsContainer.removeChild(child);
            }
        });

        let total = 0;

        // Lặp qua từng sản phẩm trong giỏ và hiển thị chúng
        cart.forEach((item) => {
            total += item.price * item.quantity;

            const cartItem = cartItemTemplate.content.cloneNode(true); // Nhân bản template

            // Gán thông tin vào các phần tử trong item
            cartItem.querySelector(".cart-item-img").src = item.image;
            cartItem.querySelector(".cart-item-name").textContent = item.name;
            cartItem.querySelector(".cart-item-price").textContent = `$${(item.price * item.quantity).toFixed(2)}`;
            cartItem.querySelector(".cart-item-qty").textContent = item.quantity;

            // Các sự kiện tăng/giảm/xoá sản phẩm
            cartItem.querySelector(".cart-item-increase").addEventListener("click", () => updateQuantity(item.id, 1));
            cartItem.querySelector(".cart-item-decrease").addEventListener("click", () => updateQuantity(item.id, -1));
            cartItem.querySelector(".btn-cart-item-remove").addEventListener("click", () => removeFromCart(item.id));

            // Thêm sản phẩm này vào danh sách hiển thị
            cartItemsContainer.appendChild(cartItem);
        });

        // Cập nhật tổng tiền ở tất cả vị trí .cart-total
        cartTotal.forEach(el => {
            el.innerText = `$${total.toFixed(2)}`;
        });

        updateCartCount(); // Cập nhật số lượng sản phẩm ở icon
    }

    // ==== CẬP NHẬT SỐ LƯỢNG SP TRONG GIỎ ====
    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id); // Nếu số lượng <= 0 thì xoá
        } else {
            saveCart();
            renderCart(); // Cập nhật lại
        }
    }

    // ==== XOÁ SP KHỎI GIỎ ====
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
    }

    // ==== LƯU GIỎ HÀNG VÀO LOCALSTORAGE ====
    let saveCartTimeout; // Dùng debounce để tránh lưu quá nhiều lần liên tục
    function saveCart() {
        clearTimeout(saveCartTimeout);
        saveCartTimeout = setTimeout(() => {
            localStorage.setItem("cart", JSON.stringify(cart)); // Lưu JSON
            updateCartCount(); // Cập nhật icon số lượng
        }, 300); // Chờ 300ms
    }

    // ==== CẬP NHẬT SỐ SẢN PHẨM Ở ICON ====
    function updateCartCount() {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.innerText = totalQuantity;
        }
    }

    // ==== GỌI KHI TRANG TẢI LẠI ====
    renderCart(); // Hiển thị giỏ khi load lại
    updateCartCount(); // Cập nhật icon
});

// =============================================================================
// ==============================    MENU MOBILE    ============================
// =============================================================================
document.addEventListener("DOMContentLoaded", function () {
    const menuMobileIcon = document.getElementById("menuMobileIcon");
    const menuMobileBlock = document.getElementById("menuMobileBlock");
    const closeMenuMobile = document.getElementById("closeMenuMobile");
    const overlayMobile = document.getElementById("overlayMobile");

    // Mở menu mobile
    menuMobileIcon.addEventListener("click", () => toggleMobile(true));
    window.toggleMobile = function (isOpen) {
        menuMobileBlock.classList.toggle("open", isOpen);
        overlayMobile.classList.toggle("show", isOpen);
        if (!isOpen) closeAllSubmenus();
    };

    const closeMobile = () => toggleMobile(false);
    closeMenuMobile?.addEventListener("click", closeMobile);
    overlayMobile?.addEventListener("click", closeMobile);

    // Mở submenu
    document.querySelectorAll(".btn-sub-nav").forEach(btn => {
        btn.addEventListener("click", function() {
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains("sub-nav-mobile")) {
                closeAllSubmenus();
                submenu.classList.add("open");
            }
        });
    });

    // Back submenu
    document.querySelectorAll(".back-sub-nav").forEach(btn => {
        btn.addEventListener("click", function() {
            this.closest(".sub-nav-mobile")?.classList.remove("open");
        });
    });

    // Close submenu (X)
    document.querySelectorAll(".close-sub-nav").forEach(btn => {
        btn.addEventListener("click", closeMobile);
    });

    // Đóng tất cả submenus
    function closeAllSubmenus() {
        document.querySelectorAll(".sub-nav-mobile.open").forEach(el => {
            el.classList.remove("open");
        });
    }
});

// =============================================================================
// ==============================    GO TO TOP    ==============================
// =============================================================================
document.addEventListener("DOMContentLoaded", function () {
    const goToTopButton = document.querySelector(".go-to-top");

    function toggleGoToTop() {
        if (window.scrollY > 100) {
            goToTopButton.classList.add("show");
        } else {
            goToTopButton.classList.remove("show");
        }
    }

    // Kiểm tra khi trang load
    toggleGoToTop();

    // Lắng nghe sự kiện cuộn
    window.addEventListener("scroll", toggleGoToTop);

    // Cuộn lên đầu khi click
    goToTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
