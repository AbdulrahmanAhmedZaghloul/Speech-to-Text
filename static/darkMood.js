
// darkmood.js

(() => {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const pen = document.querySelectorAll('.dark-p');
    const item = document.querySelectorAll('.nav-item');
    const resultBox = document.getElementById("result-box");
    const Box = document.getElementById("dark-p-p");

    // تحميل الوضع من localStorage
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        themeToggle.innerHTML = `<i class="fa-solid fa-sun text-white"></i>`;
        resultBox.classList.add("bg-transparent")
        Box.classList.remove("text-dark-emphasis")
        Box.classList.add("text-white")
        pen.forEach(el => el.classList.remove("text-dark-emphasis"));
        pen.forEach(el => el.classList.add("text-white"));
        item.forEach(el => el.classList.add("text-white"));
    }

    // تبديل الوضع عند النقر على الزر
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            themeToggle.innerHTML = `<i class="fa-solid fa-sun text-white"></i>`;
            
        Box.classList.remove("text-dark-emphasis")
        Box.classList.add("text-white")
            pen.forEach(el => el.classList.remove("text-dark-emphasis"));
            pen.forEach(el => el.classList.add("text-white"));
            item.forEach(el => el.classList.add("text-white"));

        } else {
            localStorage.setItem("theme", "light");
            themeToggle.innerHTML = `<i class="fa-solid fa-moon"></i>`;
            
        Box.classList.add("text-dark-emphasis")
        Box.classList.remove("text-white")
            pen.forEach(el => el.classList.remove("text-white"));
            pen.forEach(el => el.classList.add("text-dark-emphasis"));
            item.forEach(el => el.classList.add("text-dark-emphasis"));

        }
    });
})();

