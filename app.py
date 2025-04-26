
# #app.py

from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# تهيئة قاعدة البيانات SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///texts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# تعريف نموذج (Model) يمثل النصوص المخزنة في قاعدة البيانات
class Text(db.Model):
    id = db.Column(db.Integer, primary_key=True) # id # معرف فريد لكل نص
    content = db.Column(db.String(500), nullable=False) # text  # محتوى النص

# إنشاء جدول النصوص داخل قاعدة البيانات إذا لم يكن موجودًا
with app.app_context():
    db.create_all()

# 🏠 عرض الصفحة الرئيسية وجلب جميع النصوص المخزنة
@app.route("/")

def index():
    texts = Text.query.all()  # جلب جميع النصوص من قاعدة البيانات
    texts_list = [{"id": text.id, "content": text.content} for text in texts]  # تحويلها إلى قائمة JSON
    return render_template("index.html", texts=texts_list)  # إرسالها إلى صفحة HTML


# صفحة "من نحن"
@app.route("/about")
def about():
    return render_template("about.html")

# ✅ وظيفة لحفظ نص جديد في قاعدة البيانات
@app.route("/save_text", methods=["POST"])
def save_text():
    data = request.json  # استقبال البيانات من الطلب
    text = data.get("text")  # استخراج النص من البيانات
    if text:
        new_text = Text(content=text)  # إنشاء كائن جديد من النص
        db.session.add(new_text)  # إضافته إلى قاعدة البيانات
        db.session.commit()  # حفظ التغييرات
    return jsonify({"success": True})  # إرجاع استجابة JSON

# 📜 جلب جميع النصوص من قاعدة البيانات وفرزها تنازليًا
@app.route("/get_texts", methods=["GET"])
def get_texts():
    texts = Text.query.order_by(Text.id.desc()).all()  # جلب النصوص مرتبة من الأحدث إلى الأقدم
    texts_list = [{"id": text.id, "content": text.content} for text in texts]  # تحويلها إلى JSON
    return jsonify({"texts": texts_list})  # إرجاع البيانات كـ JSON

# ❌ وظيفة لحذف نص معين باستخدام معرفه (ID)
@app.route("/delete_text/<int:text_id>", methods=["DELETE"])
def delete_text(text_id):
    try:
        text = Text.query.get(text_id)  # البحث عن النص باستخدام المعرف
        if text:
            db.session.delete(text)  # حذف النص من قاعدة البيانات
            db.session.commit()  # حفظ التغييرات
            return jsonify({"success": True})  # إرجاع استجابة نجاح
        else:
            return jsonify({"success": False, "error": "النص غير موجود"})  # النص غير موجود
    except Exception as e:
        db.session.rollback()  # التراجع عن أي تغييرات في حالة حدوث خطأ
        return jsonify({"success": False, "error": str(e)})  # إرجاع رسالة الخطأ

# 🖊️ وظيفة لتحديث النص الموجود في قاعدة البيانات

# 🚀 تشغيل التطبيق في وضع التطوير
if __name__ == "__main__":
    app.run(debug=True)
