
// // // script.js

document.addEventListener("DOMContentLoaded", function () {
    fetchTexts(); // جلب النصوص عند تحميل الصفحة
});


// وظيفة تحديث النصوص داخل `#texts-list`
async function fetchTexts() {
    try {
        const response = await fetch("/get_texts");
        const data = await response.json();
        const textsList = document.getElementById("texts-list");
        textsList.innerHTML = ""; // مسح المحتوى الحالي
                   
        for (let i = 0; i < data.texts.length; i++) {
            let text = data.texts[i];
            textsList.innerHTML += `
                <div class='text mt-3 mb-3'>
                    <div class="p-3 border border-1 border-dark-subtle rounded-1">
                        <p>${text.id}</p>
                        <p>${text.content}</p>                        
                        <button class="delete-item-btn border-0 bg-transparent" data-id="${text.id}">
                            <i class="fa-solid fa-trash text-danger"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        // ✅ استخدام `for` العادية لإضافة أحداث الحذف
        let deleteButtons = document.querySelectorAll(".delete-item-btn");
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener("click", async () => {
                let textId = deleteButtons[i].getAttribute("data-id");
                await deleteText(textId);
            });
        }
    } catch (error) {
        console.error("Error fetching texts:", error);
    }
}

// وظيفة حذف نص محدد
async function deleteText(textId) {
    const resultBox = document.getElementById("delete-notification");

    try {
        const response = await fetch(`/delete_text/${textId}`, {
            method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
            await fetchTexts(); // إعادة تحميل النصوص بعد الحذف
            resultBox.classList.add("d-block");
            resultBox.classList.remove("d-none");

            // إخفاء الإشعار بعد 3 ثواني
            setTimeout(() => {
                resultBox.classList.add("d-none");
                resultBox.classList.remove("d-block");
            }, 3000);
        }
    } catch (error) {
        console.error("Error deleting text:", error);
        alert("حدث خطأ أثناء حذف النص!");
    }
}

// وظيفة حفظ النص
async function saveText(text) {
    try {
        const response = await fetch("/save_text", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: text }),
        });
        await response.json();
        await fetchTexts(); // تحديث القائمة بعد الحفظ
    } catch (error) {
        console.error("Error saving text:", error);
    }
}

// جعل `saveText` متاحًا ليتم استخدامه في `speechRecognition.js`
window.saveText = saveText;
