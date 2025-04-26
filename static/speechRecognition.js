
// // speechRecognition.js

document.addEventListener("DOMContentLoaded", () => {
    const recordBtn = document.getElementById("record-btn");
    const resultBox = document.getElementById("result-box");
    const result = document.getElementById("result");
    const loading = document.getElementById("loading");

    let silenceTimer;
    const SILENCE_TIMEOUT = 5000; // 5 ثواني من الصمت

    if (!("webkitSpeechRecognition" in window)) {
        alert("متصفحك لا يدعم التعرف على الصوت.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // جعل التعرف مستمراً
    recognition.interimResults = true; // الحصول على النتائج المؤقتة
    recognition.lang = "ar-EG"; // تعيين اللغة إلى العربية (مصر)

    recordBtn.addEventListener("click", async () => {
        if (recordBtn.classList.contains("recording")) {
            // إذا كان التسجيل جارياً، أوقفه
            recognition.stop(); // إيقاف التعرف
            recordBtn.classList.remove("recording"); // إزالة فئة التسجيل
            loading.style.display = "none"; // إخفاء مؤشر التحميل
            clearTimeout(silenceTimer); // إيقاف مؤقت الصمت
            return; 
        }

        // بدء التسجيل
        recordBtn.classList.add("recording"); // إضافة فئة التسجيل
        resultBox.style.display = "none"; // إخفاء صندوق النتائج
        loading.style.display = "block";    // إظهار مؤشر التحميل
        recognition.start(); // بدء التعرف على الصوت

        recognition.onresult = (event) => {
            clearTimeout(silenceTimer); // إعادة ضبط مؤقت الصمت عند اكتشاف كلام
            
            let finalTranscript = ''; // النص النهائي
            let interimTranscript = ''; // النص المؤقت

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript; 
                }
            }

            if (finalTranscript) {
                result.innerHTML = finalTranscript;
                resultBox.style.display = "block";
                saveText(finalTranscript);
            } else if (interimTranscript) {
                result.innerHTML = interimTranscript;
                resultBox.style.display = "block";
            }

            // بدء مؤقت الصمت
            silenceTimer = setTimeout(() => {
                recognition.stop();
                loading.style.display = "none";
                recordBtn.classList.remove("recording");
                if (!finalTranscript && !interimTranscript) {
                    result.innerHTML = "لم يتم اكتشاف أي كلام.";
                    resultBox.style.display = "block";
                }
            }, SILENCE_TIMEOUT);
        };

        recognition.onerror = (event) => {
            clearTimeout(silenceTimer);
            console.error("حدث خطأ:", event.error);
            result.innerHTML = "حدث خطأ أثناء التعرف على الصوت. حاول مرة أخرى.";
            resultBox.style.display = "block";
            loading.style.display = "none";
            recordBtn.classList.remove("recording");
        };

        recognition.onend = () => {
            clearTimeout(silenceTimer);
            loading.style.display = "none";
            recordBtn.classList.remove("recording");
        };
    });
});
