const layer = document.getElementById("layer");
const subscription = document.getElementById("subscription");
const locks = document.querySelectorAll(".lock");
const gopremium = document.getElementById("go-premium");

// TABS
const swiperTabs = new Swiper(".swiper-tab", {
    slidesPerView: "auto",
});
// Get all tab buttons
const tabLinks = document.querySelectorAll(".tab-link");
// Add click event listener to each button
tabLinks.forEach((button) => {
    button.addEventListener("click", () => {
        // Get the target tab id from the data attribute
        const targetTab = button.getAttribute("data-target-tab");

        // Hide all tab contents
        document.querySelectorAll(".tab-content").forEach((content) => {
            content.classList.add("flex");
            content.classList.add("hidden");
        });
        // Remove active state from all buttons
        tabLinks.forEach((btn) => {
            btn.classList.remove("text-[#1C1818]");
            btn.classList.add("text-[rgba(148,153,174,0.4)]");
        });
        // Show the target tab content
        document.querySelector(targetTab).classList.remove("hidden");
        document.querySelector(targetTab).classList.add("flex");

        // Add active state to the clicked button
        button.classList.add("text-[#1C1818]");
        button.classList.remove("text-[rgba(148,153,174,0.4)]");
    });
});

// TOMBOL LOCK
// Logika ketika salah satu elemen dengan class 'locks' diklik
locks.forEach((lock) => {
    lock.addEventListener("click", function () {
        // Hapus class 'hidden' dari elemen layer
        layer.classList.remove("hidden");

        // Hapus class 'bottom-[487px]' dari elemen subscription
        subscription.classList.remove("bottom-[487px]");

        // Tambahkan class 'bottom-0' ke elemen subscription
        subscription.classList.add("bottom-0");
    });
});

// TOMBOL GO PREMIUM
// Logika ketika 'gopremium' diklik
gopremium.addEventListener("click", function () {
    // Tambahkan class 'hidden' ke elemen layer
    layer.classList.add("hidden");
    // Hapus class 'bottom-0' dari elemen subscription
    subscription.classList.remove("bottom-0");
    // Tambahkan class 'bottom-[487px]' ke elemen subscription
    subscription.classList.add("bottom-[487px]");
});
