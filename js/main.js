// ===Slider===
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

// ===Color-products===
function changeImage(element, imageSrc) {
  // Tìm phần tử cha chứa ảnh của nút bấm
  let parentDiv = element.closest(".col-auto");
  // Tìm ảnh cần thay đổi trong phần tử cha
  let productImage = parentDiv.querySelector(".productImage");
  // Cập nhật ảnh
  productImage.src = imageSrc;
}