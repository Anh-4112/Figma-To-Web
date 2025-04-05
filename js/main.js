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
    // Lấy các phần tử DOM cần sử dụng
    const cartIcon = document.getElementById("cartIcon");
    const cartBlock = document.getElementById("cartBlock");
    const closeCart = document.getElementById("closeCart");
    const overlayCart = document.getElementById("overlayCart");
    const cartItemsContainer = document.getElementById("cartItemList");
    const cartTotal = document.querySelectorAll(".cart-total");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartItemTemplate = document.getElementById("cartItem");
    const cartCount = document.getElementById("cartCount");

    // Lấy giỏ hàng từ localStorage (nếu có) hoặc khởi tạo mảng trống
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Sự kiện mở giỏ hàng
    cartIcon.addEventListener("click", () => toggleCart(true));
    window.toggleCart = function (isOpen) {
        cartBlock.classList.toggle("open", isOpen);
        overlayCart.classList.toggle("show", isOpen);
    };

    // Sự kiện đóng giỏ hàng
    const closeCartWithAnimation = () => toggleCart(false);
    closeCart.addEventListener("click", closeCartWithAnimation);
    overlayCart.addEventListener("click", closeCartWithAnimation);

    // Thêm sản phẩm vào giỏ hàng
    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Tìm phần tử cha chứa toàn bộ thông tin sản phẩm
            const productBlock = button.closest(".wrapper-items");
    
            if (!productBlock) return;
    
            // Lấy thông tin từ các phần tử con
            const imageEl = productBlock.querySelector(".img");
            const nameEl = productBlock.querySelector(".item-name");
            const priceEl = productBlock.querySelector(".item-price");
    
            // Đảm bảo các phần tử đều có mặt
            if (!imageEl || !nameEl || !priceEl) return;
    
            // Lấy dữ liệu
            const name = nameEl.textContent.trim();
            const price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')); // bỏ ký hiệu $ nếu có
            const image = imageEl.src;
            const id = button.dataset.id || `${name.replace(/\s+/g, "-").toLowerCase()}-${price}-${image.split('/').pop()}`;
    
            // Gọi hàm thêm vào giỏ hàng
            addToCart(id, name, price, image);
        });
    });

    function addToCart(id, name, price, image) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            // Nếu sản phẩm đã có trong giỏ → Tăng số lượng
            existingItem.quantity += 1;
        } else {
            // Nếu là sản phẩm mới → Thêm vào giỏ
            cart.push({ id, name, price, image, quantity: 1 });
        }
    
        saveCart();
        renderCart();
        toggleCart(true); // Mở giỏ hàng sau khi thêm sản phẩm
    }
    

    // Hiển thị giỏ hàng
    function renderCart() {
        // Xóa tất cả cart items nhưng giữ lại template
        Array.from(cartItemsContainer.children).forEach(child => {
            if (child.tagName !== "TEMPLATE") {
                cartItemsContainer.removeChild(child);
            }
        });
    
        let total = 0;
    
        cart.forEach((item) => {
            total += item.price * item.quantity;
            const cartItem = cartItemTemplate.content.cloneNode(true);
    
            cartItem.querySelector(".cart-item-img").src = item.image;
            cartItem.querySelector(".cart-item-name").textContent = item.name;
            cartItem.querySelector(".cart-item-price").textContent = `$${(item.price * item.quantity).toFixed(2)}`;
            cartItem.querySelector(".cart-item-qty").textContent = item.quantity;
    
            cartItem.querySelector(".cart-item-increase").addEventListener("click", () => updateQuantity(item.id, 1));
            cartItem.querySelector(".cart-item-decrease").addEventListener("click", () => updateQuantity(item.id, -1));
            cartItem.querySelector(".btn-cart-item-remove").addEventListener("click", () => removeFromCart(item.id));
    
            cartItemsContainer.appendChild(cartItem);
        });
    
        cartTotal.forEach(el => {
            el.innerText = `$${total.toFixed(2)}`;
        });        
        updateCartCount();
    }
    

    // Cập nhật số lượng sản phẩm
    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCart();
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
    }

    // Lưu giỏ hàng vào localStorage
    let saveCartTimeout;
    function saveCart() {
        clearTimeout(saveCartTimeout);
        saveCartTimeout = setTimeout(() => {
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
        }, 300);
    }

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng hiển thị trên icon giỏ hàng
    function updateCartCount() {
        // Lấy phần tử DOM hiển thị số lượng sản phẩm trên icon (phần tử có id là "cartCount")
        const cartCount = document.getElementById("cartCount");

        // Tính tổng số lượng sản phẩm trong giỏ hàng bằng cách cộng dồn quantity của từng item
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Nếu phần tử hiển thị tồn tại thì cập nhật nội dung số lượng vào đó
        if (cartCount) {
            cartCount.innerText = totalQuantity;
        }
    }


    // Hiển thị lại giỏ hàng khi trang tải lại
    renderCart();
    updateCartCount();
});