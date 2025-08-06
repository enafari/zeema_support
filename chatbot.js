(function() {
    'use strict';

    // Chatbot configuration
    const config = {
        theme: {
            primary: '#E26C2B',
            secondary: '#ffffff',
            text: '#333333',
            textLight: '#666666',
            background: '#f8f9fa',
            border: '#e9ecef'
        },
        messages: {
            welcome: "سلام کاربر عزیز به پشتیبانی سکو زیما خوش آمدید!\nلطفا موضوع درخواست خود را از گزینه های زیر انتخاب کنید",
            menuItems: [
                "۱. پیگیری پرداخت سود طرح",
                "۲. اطلاعات طرح های سرمایه گذاری شده من",
                "۳. مشاوره و راهنمایی",
                "۴. اطلاع رسانی از طرح های جدید زیما",
                "۵. سایر"
            ],
            responses: {
                "۱. پیگیری پرداخت سود طرح": "برای پیگیری پرداخت سود طرح، لطفا کد ملی خود را وارد کنید تا اطلاعات دقیق برای شما ارسال شود.",
                "۲. اطلاعات طرح های سرمایه گذاری شده من": "برای مشاهده اطلاعات طرح‌های سرمایه‌گذاری شده، لطفا کد ملی خود را وارد کنید.",
                "۳. مشاوره و راهنمایی": "کارشناسان ما آماده ارائه مشاوره و راهنمایی هستند. لطفا سوال خود را مطرح کنید تا در اسرع وقت پاسخ داده شود.",
                "۴. اطلاع رسانی از طرح های جدید زیما": "برای اطلاع از طرح‌های جدید، لطفا شماره موبایل خود را وارد کنید تا از آخرین اخبار و طرح‌ها مطلع شوید.",
                "۵. سایر": "برای سایر سوالات و درخواست‌ها، لطفا با شماره پشتیبانی تماس بگیرید یا پیام خود را ارسال کنید."
            }
        }
    };

    // Create chatbot styles
    const createStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .zeema-chatbot {
                font-family: 'Vazirmatn', sans-serif;
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                direction: rtl;
            }

            .zeema-chatbot-toggle {
                width: 60px;
                height: 60px;
                background: ${config.theme.primary};
                border-radius: 50%;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(226, 108, 43, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
            }

            .zeema-chatbot-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(226, 108, 43, 0.4);
            }

            .zeema-chatbot-container {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 650px;
                background: ${config.theme.secondary};
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                transform: scale(0.8) translateY(20px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .zeema-chatbot-container.open {
                transform: scale(1) translateY(0);
                opacity: 1;
            }

            .zeema-chatbot-header {
                background: ${config.theme.primary};
                color: white;
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 20px 20px 0 0;
            }

            .zeema-chatbot-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .zeema-chatbot-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 18px;
                padding: 5px;
                border-radius: 50%;
                transition: background-color 0.3s ease;
            }

            .zeema-chatbot-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }

            .zeema-chatbot-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: ${config.theme.background};
            }

            .zeema-message {
                margin-bottom: 15px;
                display: flex;
                flex-direction: column;
                opacity: 0;
                transform: translateY(20px);
                animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }

            @keyframes messageSlideIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .zeema-message.user {
                align-items: flex-end;
            }

            .zeema-message.bot {
                align-items: flex-start;
            }

            .zeema-message-avatar {
                width: 30px;
                height: 30px;
                background: ${config.theme.primary};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .zeema-message-content {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 18px;
                word-wrap: break-word;
                line-height: 1.4;
                font-size: 14px;
            }

            .zeema-message.user .zeema-message-content {
                background: ${config.theme.primary};
                color: white;
                border-bottom-right-radius: 4px;
            }

            .zeema-message.bot .zeema-message-content {
                background: white;
                color: ${config.theme.text};
                border: 1px solid ${config.theme.border};
                border-bottom-left-radius: 4px;
            }

            .zeema-timestamp {
                font-size: 11px;
                color: ${config.theme.textLight};
                margin-top: 4px;
                opacity: 0.7;
            }

            .zeema-menu-items {
                margin-top: 10px;
            }

            .zeema-menu-item {
                background: white;
                border: 1px solid ${config.theme.border};
                border-radius: 8px;
                padding: 8px 12px;
                margin-bottom: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 13px;
                color: ${config.theme.text};
                line-height: 1.3;
            }

            .zeema-menu-item:hover {
                background: ${config.theme.primary};
                color: white;
                transform: translateX(-5px);
                box-shadow: 0 4px 12px rgba(226, 108, 43, 0.3);
            }

            .zeema-plans-menu {
                margin-top: 10px;
            }

            .zeema-plan-item {
                background: #e8f5e8;
                border: 1px solid #4caf50;
                border-radius: 8px;
                padding: 8px 12px;
                margin-bottom: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 13px;
                color: #2e7d32;
                font-weight: 500;
                line-height: 1.3;
            }

            .zeema-plan-item:hover {
                background: #4caf50;
                color: white;
                transform: translateX(-5px);
                box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
            }

            .zeema-return-menu {
                background: #f8f9fa;
                border-color: #dee2e6;
                color: #6c757d;
                font-style: italic;
            }

            .zeema-return-menu:hover {
                background: #e9ecef;
                color: #495057;
                transform: translateX(-5px);
                box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
            }

            .zeema-loading {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                background: white;
                border: 1px solid ${config.theme.border};
                border-radius: 18px;
                border-bottom-left-radius: 4px;
                max-width: 80%;
                margin-bottom: 15px;
                opacity: 0;
                transform: translateY(20px);
                animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }

            .zeema-loading-dots {
                display: flex;
                gap: 4px;
            }

            .zeema-loading-dot {
                width: 8px;
                height: 8px;
                background: ${config.theme.primary};
                border-radius: 50%;
                animation: loadingDot 1.4s infinite ease-in-out;
            }

            .zeema-loading-dot:nth-child(1) { animation-delay: -0.32s; }
            .zeema-loading-dot:nth-child(2) { animation-delay: -0.16s; }
            .zeema-loading-dot:nth-child(3) { animation-delay: 0s; }

            @keyframes loadingDot {
                0%, 80%, 100% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }



            .zeema-input-container {
                padding: 15px 20px;
                background: white;
                border-top: 1px solid ${config.theme.border};
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .zeema-input-field {
                flex: 1;
                border: 1px solid ${config.theme.border};
                border-radius: 20px;
                padding: 10px 15px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.3s ease;
                font-family: inherit;
            }

            .zeema-input-field:focus {
                border-color: ${config.theme.primary};
            }

            .zeema-send-button {
                background: ${config.theme.primary};
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                font-size: 16px;
            }

            .zeema-send-button:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(226, 108, 43, 0.3);
            }

            .zeema-send-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            @media (max-width: 480px) {
                .zeema-chatbot-container {
                    width: 320px;
                    height: 450px;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Create chatbot HTML
    const createChatbotHTML = () => {
        const div = document.createElement('div');
        div.className = 'zeema-chatbot';
        div.innerHTML = `
            <button class="zeema-chatbot-toggle">زی</button>
            <div class="zeema-chatbot-container">
                <div class="zeema-chatbot-header">
                    <h3>پشتیبانی زیما</h3>
                    <button class="zeema-chatbot-close">×</button>
                </div>
                <div class="zeema-chatbot-messages"></div>
                <div class="zeema-input-container">
                    <input type="text" class="zeema-input-field" placeholder="پیام خود را بنویسید...">
                    <button class="zeema-send-button">→</button>
                </div>
            </div>
        `;
        return div;
    };

    class ZeemaChatbot {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.currentState = 'menu'; // menu, waiting_for_national_id, waiting_for_question
            this.selectedOption = null;
            this.apiService = null;
            this.init();
        }

        init() {
            createStyles();
            this.createChatbot();
            this.bindEvents();
            this.sendWelcomeMessage();
            
            // Initialize API service if available
            try {
                if (window.ZeemaAPIService) {
                    this.apiService = new window.ZeemaAPIService();
                    console.log('API service initialized successfully');
                    
                    // Verify the method exists
                    if (typeof this.apiService.get_invested_plans === 'function') {
                        console.log('✅ get_invested_plans method is available');
                    } else {
                        console.log('❌ get_invested_plans method is NOT available');
                        console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.apiService)));
                        this.apiService = null; // Reset if method doesn't exist
                    }
                } else {
                    console.log('ZeemaAPIService not available in window object');
                    this.apiService = null;
                }
            } catch (error) {
                console.error('Error initializing API service:', error);
                this.apiService = null;
            }
        }

        createChatbot() {
            this.element = createChatbotHTML();
            this.container = this.element.querySelector('.zeema-chatbot-container');
            this.messagesContainer = this.element.querySelector('.zeema-chatbot-messages');
            this.toggleButton = this.element.querySelector('.zeema-chatbot-toggle');
            this.closeButton = this.element.querySelector('.zeema-chatbot-close');
            this.inputField = this.element.querySelector('.zeema-input-field');
            this.sendButton = this.element.querySelector('.zeema-send-button');
            
            document.body.appendChild(this.element);
        }

        bindEvents() {
            this.toggleButton.addEventListener('click', () => this.toggle());
            this.closeButton.addEventListener('click', () => this.close());
            this.sendButton.addEventListener('click', () => this.sendMessage());
            this.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
            

        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            this.container.style.display = 'flex';
            // Trigger animation after display is set
            setTimeout(() => {
                this.container.classList.add('open');
            }, 10);
            this.isOpen = true;
            this.inputField.focus();
        }

        close() {
            this.container.classList.remove('open');
            // Wait for animation to complete before hiding
            setTimeout(() => {
                this.container.style.display = 'none';
            }, 300);
            this.isOpen = false;
        }

        sendWelcomeMessage() {
            this.addMessage(config.messages.welcome, 'bot');
            this.addMenuItems();
        }

        addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `zeema-message ${sender}`;
            
            const timestamp = new Date().toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit'
            });

            if (sender === 'bot') {
                messageDiv.innerHTML = `
                    <div class="zeema-message-avatar">زی</div>
                    <div class="zeema-message-content">${text}</div>
                    <div class="zeema-timestamp">${timestamp}</div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="zeema-message-content">${text}</div>
                    <div class="zeema-timestamp">${timestamp}</div>
                `;
            }

            this.messagesContainer.appendChild(messageDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }

        addReturnToMainMenu() {
            const menuDiv = document.createElement('div');
            menuDiv.className = 'zeema-menu-items';
            
            const returnMenuItem = document.createElement('div');
            returnMenuItem.className = 'zeema-menu-item zeema-return-menu';
            returnMenuItem.textContent = 'بازگشت به منوی اصلی';
            returnMenuItem.addEventListener('click', () => this.handleMenuClick('بازگشت به منوی اصلی'));
            menuDiv.appendChild(returnMenuItem);

            this.messagesContainer.appendChild(menuDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }

        addLoadingMessage() {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'zeema-loading';
            loadingDiv.innerHTML = `
                <div class="zeema-message-avatar">زی</div>
                <div class="zeema-loading-dots">
                    <div class="zeema-loading-dot"></div>
                    <div class="zeema-loading-dot"></div>
                    <div class="zeema-loading-dot"></div>
                </div>
            `;
            
            this.messagesContainer.appendChild(loadingDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            return loadingDiv;
        }

        addMenuItems() {
            const menuDiv = document.createElement('div');
            menuDiv.className = 'zeema-menu-items';
            
            config.messages.menuItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'zeema-menu-item';
                menuItem.textContent = item;
                menuItem.addEventListener('click', () => this.handleMenuClick(item));
                menuDiv.appendChild(menuItem);
            });

            // Add return to main menu item
            const returnMenuItem = document.createElement('div');
            returnMenuItem.className = 'zeema-menu-item zeema-return-menu';
            returnMenuItem.textContent = 'بازگشت به منوی اصلی';
            returnMenuItem.addEventListener('click', () => this.handleMenuClick('بازگشت به منوی اصلی'));
            menuDiv.appendChild(returnMenuItem);

            this.messagesContainer.appendChild(menuDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }

        handleMenuClick(menuItem) {
            this.addMessage(menuItem, 'user');
            
            // Remove existing menu items
            const existingMenu = this.messagesContainer.querySelector('.zeema-menu-items');
            if (existingMenu) {
                existingMenu.remove();
            }

            // Handle different menu options
            setTimeout(() => {
                if (menuItem === "بازگشت به منوی اصلی") {
                    this.returnToMainMenu();
                } else if (menuItem === "۱. پیگیری پرداخت سود طرح" || menuItem === "۲. اطلاعات طرح های سرمایه گذاری شده من") {
                    this.selectedOption = menuItem;
                    this.currentState = 'waiting_for_national_id';
                    this.addMessage("لطفا کد ملی خود را وارد کنید:", 'bot');
                } else {
                    const response = config.messages.responses[menuItem];
                    this.addMessage(response, 'bot');
                    this.currentState = 'menu';
                }
            }, 500);
        }

        returnToMainMenu() {
            this.currentState = 'menu';
            this.selectedOption = null;
            this.addMessage(config.messages.welcome, 'bot');
            this.addMenuItems();
        }



        async sendMessage() {
            const text = this.inputField.value.trim();
            if (!text) return;

            this.addMessage(text, 'user');
            this.inputField.value = '';

            // Handle different states
            if (this.currentState === 'waiting_for_national_id') {
                await this.handleNationalIdInput(text);
            } else if (this.currentState === 'waiting_for_question') {
                this.addMessage('پیام شما دریافت شد. کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.', 'bot');
                this.addReturnToMainMenu();
                this.currentState = 'menu';
            } else {
                // Default response
                setTimeout(() => {
                    this.addMessage('پیام شما دریافت شد. کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.', 'bot');
                    this.addReturnToMainMenu();
                }, 1000);
            }
        }

        async handleNationalIdInput(nationalId) {
            try {
                // Show loading animation
                const loadingElement = this.addLoadingMessage();

                // Use API if available, otherwise use mock response
                if (this.apiService && typeof this.apiService.get_invested_plans === 'function') {
                    console.log('Using API service for national ID:', nationalId);
                    try {
                        const result = await this.apiService.get_invested_plans(nationalId);
                        
                        // Remove loading animation
                        if (loadingElement) {
                            loadingElement.remove();
                        }
                        
                        if (result.success && result.data && result.data.length > 0) {
                            // Create the new template message
                            const userData = result.data[0];
                            const first_name = userData.first_name || 'کاربر';
                            const last_name = userData.last_name || 'عزیز';
                            
                                                // Extract all invested plans from the data (each row represents one investment)
                    const investedPlans = [];
                    result.data.forEach(item => {
                        if (item['plans - plan_id → persian_confirmed_symbol']) {
                            const planSymbol = item['plans - plan_id → persian_confirmed_symbol'];
                            investedPlans.push(planSymbol);
                        }
                    });
                    
                    // Create the message template
                    let message = `${first_name} ${last_name} عزیز شما تا کنون روی طرح های زیر سرمایه گذاری کرده اید:\n\n`;
                    
                    investedPlans.forEach((planSymbol, index) => {
                        message += `"${planSymbol}"\n`;
                    });
                    
                    message += `\nجهت بررسی اطلاعات هر طرح روی آن کلیک کنید`;
                    
                                                this.addMessage(message, 'bot');
                            
                            // Add menu for all invested plans
                            this.addPlansMenu(investedPlans);
                            
                        } else {
                            this.addMessage('❌ اطلاعاتی برای این کد ملی یافت نشد. لطفا با پشتیبانی تماس بگیرید.', 'bot');
                            this.addReturnToMainMenu();
                        }
                                                        } catch (apiError) {
                        console.error('API call failed:', apiError);
                        // Remove loading animation
                        if (loadingElement) {
                            loadingElement.remove();
                        }
                        this.addMessage('❌ خطا در اتصال به سرور. لطفا دوباره تلاش کنید.', 'bot');
                        this.addReturnToMainMenu();
                    }
                } else {
                    console.log('API service not available, using mock response');
                    // Mock response if API is not available
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Remove loading animation
                    if (loadingElement) {
                        loadingElement.remove();
                    }
                    
                    if (this.selectedOption === "۱. پیگیری پرداخت سود طرح") {
                        this.addMessage('📊 اطلاعات پیگیری پرداخت سود طرح:\n\n👤 نام: کاربر نمونه\n📈 تعداد طرح‌ها: 2\n\n📋 لیست طرح‌های سرمایه‌گذاری شده:\n1. طرح سرمایه‌گذاری طلا\n2. طرح سرمایه‌گذاری ارز', 'bot');
                        this.addReturnToMainMenu();
                    } else if (this.selectedOption === "۲. اطلاعات طرح های سرمایه گذاری شده من") {
                        // Create mock template message
                        const message = `"کاربر" "نمونه" عزیز شما تا کنون روی طرح های زیر سرمایه گذاری کرده اید:\n\n"زیویتایک"\n"زیماقهوه"\n\nجهت بررسی اطلاعات هر طرح روی آن کلیک کنید`;
                        this.addMessage(message, 'bot');
                        
                        // Add mock plans menu
                        this.addPlansMenu(['زیویتایک', 'زیماقهوه']);
                    }
                }
                
                // Reset state
                this.currentState = 'menu';
                this.selectedOption = null;
                
            } catch (error) {
                console.error('Error handling national ID:', error);
                // Remove loading animation
                if (loadingElement) {
                    loadingElement.remove();
                }
                this.addMessage('❌ خطا در دریافت اطلاعات. لطفا دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.', 'bot');
                this.addReturnToMainMenu();
                this.currentState = 'menu';
            }
        }

        addPlansMenu(plans) {
            const menuDiv = document.createElement('div');
            menuDiv.className = 'zeema-plans-menu';
            
            plans.forEach((plan, index) => {
                const menuItem = document.createElement('div');
                menuItem.className = 'zeema-plan-item';
                menuItem.textContent = `${index + 1}. ${plan}`;
                menuItem.addEventListener('click', () => this.handlePlanClick(plan));
                menuDiv.appendChild(menuItem);
            });

            // Add return to main menu item
            const returnMenuItem = document.createElement('div');
            returnMenuItem.className = 'zeema-menu-item zeema-return-menu';
            returnMenuItem.textContent = 'بازگشت به منوی اصلی';
            returnMenuItem.addEventListener('click', () => this.handleMenuClick('بازگشت به منوی اصلی'));
            menuDiv.appendChild(returnMenuItem);

            this.messagesContainer.appendChild(menuDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }

        handlePlanClick(planName) {
            this.addMessage(`${planName}`, 'user');
            
            // Remove existing plan menu
            const existingMenu = this.messagesContainer.querySelector('.zeema-plans-menu');
            if (existingMenu) {
                existingMenu.remove();
            }

            // Add plan details message
            setTimeout(() => {
                this.addMessage(`📋 اطلاعات طرح ${planName}:\n\n🔍 در حال بارگذاری جزئیات...`, 'bot');
                this.addReturnToMainMenu();
            }, 500);
        }
    }

    // Initialize chatbot when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ZeemaChatbot());
    } else {
        new ZeemaChatbot();
    }
})(); 