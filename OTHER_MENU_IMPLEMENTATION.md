# منوی سایر - پیاده‌سازی

## توضیحات
این سند نحوه پیاده‌سازی منوی "۵. سایر" و زیرمنوهای آن را توضیح می‌دهد.

## تغییرات اعمال شده

### ۱. تغییر پیام پاسخ
در فایل `chatbot.js`، پیام پاسخ برای گزینه "۵. سایر" تغییر یافت:

```javascript
"۵. سایر": "برای کدام یک از موارد زیر نیاز به پشتیبانی دارید؟"
```

### ۲. اضافه کردن متد `addOtherMenu()`
متد جدیدی برای نمایش زیرمنوی "سایر" اضافه شد:

```javascript
addOtherMenu() {
    const menuDiv = document.createElement('div');
    menuDiv.className = 'zeema-menu-items';
    
    const otherItems = [
        "۱. موعد واریز سودم امروز هستش ولی هنوز سودی برام واریز نشده",
        "۲. جواب سوالم رو پیدا نکردم"
    ];
    
    // ایجاد آیتم‌های منو
    otherItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'zeema-menu-item';
        menuItem.textContent = item;
        menuItem.addEventListener('click', () => this.handleOtherMenuClick(item));
        menuDiv.appendChild(menuItem);
    });

    // اضافه کردن دکمه بازگشت
    const returnMenuItem = document.createElement('div');
    returnMenuItem.className = 'zeema-menu-item zeema-return-menu';
    returnMenuItem.textContent = 'بازگشت به منوی اصلی';
    returnMenuItem.addEventListener('click', () => this.handleMenuClick('بازگشت به منوی اصلی'));
    menuDiv.appendChild(returnMenuItem);

    this.messagesContainer.appendChild(menuDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
}
```

### ۳. اضافه کردن متد `handleOtherMenuClick()`
متد جدیدی برای مدیریت کلیک روی آیتم‌های زیرمنوی "سایر":

```javascript
handleOtherMenuClick(menuItem) {
    this.addMessage(menuItem, 'user');
    
    // حذف منوی موجود
    const existingMenu = this.messagesContainer.querySelector('.zeema-menu-items');
    if (existingMenu) {
        existingMenu.remove();
    }

    // مدیریت گزینه‌های مختلف
    setTimeout(() => {
        if (menuItem === "۱. موعد واریز سودم امروز هستش ولی هنوز سودی برام واریز نشده") {
            const response = "این موضوع می‌تواند دو حالت داشته باشد:\n\nروز کاری – چنانچه موعد واریز سود در یک روز کاری باشد، پرداخت همان روز در حال پردازش است و حداکثر ظرف ۲۴ ساعت آینده به حساب شما واریز خواهد شد.\n\nروز غیرکاری – در صورتی که موعد واریز سود در روز غیرکاری (مانند تعطیلات رسمی) باشد، پرداخت در اولین روز کاری پس از آن انجام می‌شود.\n\nدر صورت بروز هرگونه تأخیر در پرداخت سود، اطلاع‌رسانی لازم به کلیه سرمایه‌گذاران آن طرح انجام خواهد شد.";
            this.addMessage(response, 'bot');
        } else if (menuItem === "۲. جواب سوالم رو پیدا نکردم") {
            const response = "اگر جواب سوالات خود را پیدا نکردید میتوانید با پشتیبانی ما تماس بگیرید\n021-92008828";
            this.addMessage(response, 'bot');
        }
        
        // اضافه کردن دکمه بازگشت
        setTimeout(() => {
            this.addReturnToMainMenu();
        }, 1000);
    }, 500);
}
```

### ۴. تغییر متد `handleMenuClick()`
متد `handleMenuClick` برای پشتیبانی از منوی "سایر" تغییر یافت:

```javascript
} else if (menuItem === "۵. سایر") {
    const response = config.messages.responses[menuItem];
    this.addMessage(response, 'bot');
    this.currentState = 'other_menu';
    // اضافه کردن منوی سایر بعد از پیام
    setTimeout(() => {
        this.addOtherMenu();
    }, 500);
}
```

## گزینه‌های زیرمنوی "سایر"

### ۱. موعد واریز سودم امروز هستش ولی هنوز سودی برام واریز نشده
**پاسخ:** توضیح کامل درباره زمان‌بندی واریز سود در روزهای کاری و غیرکاری

### ۲. جواب سوالم رو پیدا نکردم
**پاسخ:** شماره تماس پشتیبانی: 021-92008828

## تست عملکرد

برای تست عملکرد، فایل `test_other_menu.html` ایجاد شده است که شامل:
- راهنمای کامل تست
- مراحل بررسی عملکرد
- نمایش صحیح پیام‌ها و منوها

## نکات مهم

1. **سازگاری:** تمام تغییرات با ساختار موجود چت‌بات سازگار هستند
2. **استایل:** از همان استایل‌های موجود برای منوها استفاده می‌شود
3. **بازگشت:** دکمه بازگشت به منوی اصلی در تمام سطوح موجود است
4. **زمان‌بندی:** تاخیرهای مناسب برای نمایش پیام‌ها اعمال شده است

## فایل‌های تغییر یافته

- `chatbot.js` - فایل اصلی چت‌بات
- `test_other_menu.html` - فایل تست جدید
- `OTHER_MENU_IMPLEMENTATION.md` - این فایل مستندات 