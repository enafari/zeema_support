(function() {
    'use strict';

    // Chatbot configuration
    const config = {
        theme: {
            primary: '#007AFF',
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
                "۴. اطلاع رسانی از طرح های جدید زیما": "کاربر عزیز برای اطلاع رسانی از طرح های جدید زیما میتوانید ما را در شبکه های اجتماعی زیر دنبال کنید.\nاطلاع رسانی طرح های جدید تنها در کانال های زیر انجام خواهد شد",
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
                width: 120px;
                height: 50px;
                background: ${config.theme.primary};
                border-radius: 25px;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 13px;
                font-weight: 500;
                font-family: 'Vazirmatn', sans-serif;
                padding: 0 15px;
            }

            .zeema-chatbot-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0, 122, 255, 0.4);
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
                align-items: flex-start;
            }

            .zeema-message.bot {
                align-items: flex-end;
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
                border-bottom-left-radius: 4px;
            }

            .zeema-message.bot .zeema-message-content {
                background: white;
                color: ${config.theme.text};
                border: 1px solid ${config.theme.border};
                border-bottom-right-radius: 4px;
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
                box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
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

            .zeema-social-menu-item {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: 1px solid #667eea;
                border-radius: 8px;
                padding: 10px 12px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 13px;
                color: white;
                line-height: 1.3;
                font-weight: 500;
                text-align: center;
                position: relative;
                overflow: hidden;
            }

            .zeema-social-menu-item:hover {
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                transform: translateX(-5px) scale(1.02);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .zeema-social-menu-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }

            .zeema-social-menu-item:hover::before {
                left: 100%;
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
                box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
            }

            .zeema-send-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            @media (max-width: 480px) {
                .zeema-chatbot-container {
                    width: 100vw;
                    height: 100vh;
                    bottom: 0;
                    right: 0;
                    border-radius: 0;
                    position: fixed;
                }
                
                .zeema-chatbot-header {
                    border-radius: 0;
                }
                
                .zeema-chatbot-toggle {
                    width: 100px;
                    height: 45px;
                    font-size: 13px;
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
            <button class="zeema-chatbot-toggle">پشتیبانی زیما</button>
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
            this.chatId = null; // Store the chat_id for the current session
            this.storedPlanIds = []; // Store plan IDs for timeline functionality
            this.storedInvestedPlansData = []; // Store complete data for persian_confirmed_symbol
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
                        
                        // Check for insert_chat_id method
                        if (typeof this.apiService.insert_chat_id === 'function') {
                            console.log('✅ insert_chat_id method is available');
                            
                            // Check for insert_national_id method
                            if (typeof this.apiService.insert_national_id === 'function') {
                                console.log('✅ insert_national_id method is available');
                            } else {
                                console.log('❌ insert_national_id method is NOT available');
                            }
                        } else {
                            console.log('❌ insert_chat_id method is NOT available');
                            console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.apiService)));
                            this.apiService = null; // Reset if method doesn't exist
                        }
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
            this.toggleButton.addEventListener('click', async () => await this.toggle());
            this.closeButton.addEventListener('click', () => this.close());
            this.sendButton.addEventListener('click', () => this.sendMessage());
            this.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
            

        }

        async toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                await this.open();
            }
        }

        async open() {
            this.container.style.display = 'flex';
            // Trigger animation after display is set
            setTimeout(() => {
                this.container.classList.add('open');
            }, 10);
            this.isOpen = true;
            this.inputField.focus();
            
            // Generate new chat_id for this session if not already generated
            if (!this.chatId && this.apiService) {
                try {
                    console.log('🔄 Generating new chat_id for this session...');
                    const result = await this.apiService.insert_chat_id();
                    
                    if (result.success) {
                        this.chatId = result.data.chat_id;
                        console.log('✅ New chat session started with chat_id:', this.chatId);
                        
                        // Expose chat_id to global scope
                        this.exposeChatId();
                        
                        // Add a subtle indicator that chat_id was generated (optional)
                        // You can remove this if you don't want to show it to users
                        console.log('📝 Chat session info:', {
                            chat_id: this.chatId,
                            created_at: result.data.created_at
                        });
                    } else {
                        console.error('❌ Failed to generate chat_id:', result.message);
                    }
                } catch (error) {
                    console.error('❌ Error generating chat_id:', error);
                }
            } else if (this.chatId) {
                console.log('📝 Continuing existing chat session with chat_id:', this.chatId);
            } else if (!this.apiService) {
                console.log('⚠️ API service not available, skipping chat_id generation');
            }
        }

        close() {
            this.container.classList.remove('open');
            // Wait for animation to complete before hiding
            setTimeout(() => {
                this.container.style.display = 'none';
            }, 300);
            this.isOpen = false;
            
            // Optionally reset chat session when closed
            // Uncomment the next line if you want to start a fresh session every time the chatbot is closed
            // this.resetChatSession();
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

            // Convert \n to <br> tags for proper line breaks in HTML
            const formattedText = text.replace(/\n/g, '<br>');

            if (sender === 'bot') {
                messageDiv.innerHTML = `
                    <div class="zeema-message-avatar">زی</div>
                    <div class="zeema-message-content">${formattedText}</div>
                    <div class="zeema-timestamp">${timestamp}</div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="zeema-message-content">${formattedText}</div>
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

        addSocialMediaMenu() {
            const menuDiv = document.createElement('div');
            menuDiv.className = 'zeema-menu-items';
            
            const socialMediaItems = [
                { label: 'کانال بله', link: 'http://ble.ir/Zeemacrowd' },
                { label: 'کانال تلگرام', link: 'http://t.me/zeemacrowd' },
                { label: 'پیج اینستاگرام', link: 'http://instagram.com/zeema.fund' }
            ];
            
            socialMediaItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'zeema-social-menu-item';
                menuItem.textContent = item.label;
                menuItem.addEventListener('click', () => {
                    // Open link in new tab
                    window.open(item.link, '_blank');
                    // Add user message to show what was clicked
                    this.addMessage(`انتخاب: ${item.label}`, 'user');
                    // Show confirmation message
                    setTimeout(() => {
                        this.addMessage(`لینک ${item.label} در تب جدید باز شد.`, 'bot');
                        this.addReturnToMainMenu();
                    }, 500);
                });
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
                } else if (menuItem === "۴. اطلاع رسانی از طرح های جدید زیما") {
                    const response = config.messages.responses[menuItem];
                    this.addMessage(response, 'bot');
                    this.currentState = 'social_media_menu';
                    // Add social media menu after the message
                    setTimeout(() => {
                        this.addSocialMediaMenu();
                    }, 500);
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

            // Log message with chat_id if available
            if (this.chatId) {
                console.log(`💬 Message sent in chat ${this.chatId}:`, text);
            }

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
                            let message = `${first_name} ${last_name} عزیز شما تا الان روی طرح های زیر سرمایه گذاری کرده اید:\n\n`;
                            
                            result.data.forEach((item, index) => {
                                const planTitle = item['plans - plan_id → title'] || 'نامشخص';
                                const planSymbol = item['plans - plan_id → persian_confirmed_symbol'] || 'نامشخص';
                                const investmentAmount = item['transactions → amount'] || 'نامشخص';
                                
                                message += `🟠 نام طرح: ${planTitle}\n`;
                                message += `🔸 نماد طرح: ${planSymbol}\n`;
                                message += `🔸 مبلغ سرمایه گذاری شما: ${investmentAmount} تومان\n\n`;
                            });
                            
                            message += `جهت بررسی اطلاعات هر طرح روی آن کلیک کنید`;
                            
                            this.addMessage(message, 'bot');
                            
                            // Store plan IDs and complete data for later use in timeline API
                            const planIds = result.data.map(item => item['plans - plan_id'] || item['transactions → plan_id'] || 'نامشخص');
                            this.storedPlanIds = planIds; // Store for timeline API
                            this.storedInvestedPlansData = result.data; // Store complete data for persian_confirmed_symbol
                            
                            // Handle different menu options
                            if (this.selectedOption === "۱. پیگیری پرداخت سود طرح") {
                                // Show plan menu for individual plan selection
                                const planSymbols = result.data.map(item => item['plans - plan_id → persian_confirmed_symbol'] || 'نامشخص');
                                this.addPlansMenu(planSymbols, planIds);
                            } else if (this.selectedOption === "۲. اطلاعات طرح های سرمایه گذاری شده من") {
                                // Show timeline menu for timeline view
                                this.addTimelineMenu();
                            }
                            
                            // Insert national_id into chats table if we have a chat_id
                            if (this.chatId && this.apiService && typeof this.apiService.insert_national_id === 'function') {
                                try {
                                    console.log(`🔄 Inserting national_id for chat ${this.chatId} and national_id ${nationalId}`);
                                    const insertResult = await this.apiService.insert_national_id(nationalId, this.chatId);
                                    
                                    if (insertResult.success) {
                                        console.log('✅ National ID inserted successfully:', insertResult.data);
                                    } else {
                                        console.warn('⚠️ Failed to insert national_id:', insertResult.message);
                                    }
                                } catch (insertError) {
                                    console.error('❌ Error inserting national_id:', insertError);
                                }
                            } else {
                                console.log('⚠️ Skipping national_id insertion - chat_id or API not available');
                            }
                            
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
                    console.log('API service not available');
                    // Remove loading animation
                    if (loadingElement) {
                        loadingElement.remove();
                    }
                    
                    this.addMessage('❌ سرویس API در دسترس نیست. لطفا با پشتیبانی تماس بگیرید.', 'bot');
                    this.addReturnToMainMenu();
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

        addPlansMenu(plans, planIds) {
            const menuDiv = document.createElement('div');
            menuDiv.className = 'zeema-plans-menu';
            
            plans.forEach((plan, index) => {
                const menuItem = document.createElement('div');
                menuItem.className = 'zeema-plan-item';
                menuItem.textContent = `${index + 1}. ${plan}`;
                const planId = planIds && planIds[index] ? planIds[index] : plan;
                menuItem.addEventListener('click', () => this.handlePlanClick(plan, planId));
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

        async handlePlanClick(planName, planId) {
            this.addMessage(`${planName}`, 'user');
            
            // Remove existing plan menu
            const existingMenu = this.messagesContainer.querySelector('.zeema-plans-menu');
            if (existingMenu) {
                existingMenu.remove();
            }

            // Show loading message
            const loadingMessage = this.addMessage(`📋 اطلاعات طرح ${planName}:\n\n🔍 در حال بارگذاری جزئیات...`, 'bot');
            
            try {
                // Call get_plan_phase API if available
                if (this.apiService && typeof this.apiService.get_plan_phase === 'function') {
                    console.log('Calling get_plan_phase API for plan ID:', planId);
                    const result = await this.apiService.get_plan_phase(planId);
                    
                    // Remove loading message
                    if (loadingMessage) {
                        loadingMessage.remove();
                    }
                    
                    if (result.success && result.data && result.data.length > 0) {
                        // Format the plan phase data
                        const formattedMessage = window.ZeemaUtils ? 
                            await window.ZeemaUtils.formatPlanPhaseMessage(result.data) :
                            await this.formatPlanPhaseMessage(result.data);
                        
                        this.addMessage(formattedMessage, 'bot');
                        
                        // Add menu for plan phases using titles
                        const phaseTitles = result.data.map(phase => 
                            phase.title || phase.phase_name || 'نامشخص'
                        );
                        this.addPhaseMenu(phaseTitles);
                        
                    } else {
                        this.addMessage('❌ اطلاعاتی برای این طرح یافت نشد.', 'bot');
                        this.addReturnToMainMenu();
                    }
                } else {
                    // API service not available
                    if (loadingMessage) {
                        loadingMessage.remove();
                    }
                    
                    this.addMessage('❌ سرویس API در دسترس نیست. لطفا با پشتیبانی تماس بگیرید.', 'bot');
                    this.addReturnToMainMenu();
                }
                
            } catch (error) {
                console.error('Error handling plan click:', error);
                
                // Remove loading message
                if (loadingMessage) {
                    loadingMessage.remove();
                }
                
                this.addMessage('❌ خطا در دریافت اطلاعات طرح. لطفا دوباره تلاش کنید.', 'bot');
                this.addReturnToMainMenu();
            }
        }

        addPhaseMenu(phases) {
            const menuDiv = document.createElement('div');
            menuDiv.className = 'zeema-plans-menu';
            
            phases.forEach((phase, index) => {
                const menuItem = document.createElement('div');
                menuItem.className = 'zeema-plan-item';
                menuItem.textContent = `${index + 1}. ${phase}`;
                menuItem.addEventListener('click', () => this.handlePhaseClick(phase));
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

        handlePhaseClick(phaseName) {
            this.addMessage(`${phaseName}`, 'user');
            
            // Remove existing phase menu
            const existingMenu = this.messagesContainer.querySelector('.zeema-plans-menu');
            if (existingMenu) {
                existingMenu.remove();
            }

            // Add phase details message
            setTimeout(() => {
                this.addMessage(`📋 جزئیات ${phaseName}:\n\n🔍 در حال بارگذاری جزئیات تراکنش...`, 'bot');
                this.addReturnToMainMenu();
            }, 500);
        }

        async formatPlanPhaseMessage(planPhases) {
            if (!planPhases || planPhases.length === 0) {
                return 'هیچ مرحله‌ای برای این طرح یافت نشد.';
            }
            
            let message = 'جزئیات پرداخت سود طرح:\n\n';
            
            // Process phases sequentially to handle async date conversion
            for (const phase of planPhases) {
                const title = phase.title || phase.phase_name || 'نامشخص';
                const startDate = phase.start_date ? await this.convertToSolarCalendar(phase.start_date) : 'نامشخص';
                const percent = phase.percent || phase.percentage || 'نامشخص';
                const status = this.mapStatusToPersian(phase.status);
                
                message += `⚪️ ${title}\n`;
                message += `▪️ تاریخ: ${startDate}\n`;
                message += `▪️ میزان سود: ${percent} درصد\n`;
                message += `▪️ وضعیت: ${status}\n\n`;
            }
            
            message += 'اگر تاریخ واریز سودتان امروز است پرداختتان در حال پردازش است و چون شبا میشود طی ۲۴ ساعت آینده به حسابتان واریز خواهد شد.\n';
            message += 'جهت بررسی جزئیات تراکنش هر مرحله سود روی آن کلیک کنید';
            
            return message;
        }

        async convertToSolarCalendar(gregorianDate) {
            try {
                // Use Python date converter API if available
                const response = await fetch(`http://localhost:8001/api/convert_date?date=${encodeURIComponent(gregorianDate)}`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        return data.solar_date;
                    } else {
                        console.error('Date conversion API error:', data.message);
                        return this.convertToSolarCalendarFallback(gregorianDate);
                    }
                } else {
                    console.error('Date conversion API not available, using fallback');
                    return this.convertToSolarCalendarFallback(gregorianDate);
                }
            } catch (error) {
                console.error('Error calling date conversion API:', error);
                return this.convertToSolarCalendarFallback(gregorianDate);
            }
        }

        convertToSolarCalendarFallback(gregorianDate) {
            try {
                const date = new Date(gregorianDate);
                if (isNaN(date.getTime())) {
                    return 'نامشخص';
                }
                
                // Simple conversion - approximate
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                
                // Convert to Persian year (approximate)
                // Persian year starts around March 21st
                const persianYear = year - 621;
                
                // Adjust for Persian calendar months
                // Persian months: Farvardin(1), Ordibehesht(2), Khordad(3), Tir(4), Mordad(5), Shahrivar(6)
                // Persian months: Mehr(7), Aban(8), Azar(9), Dey(10), Bahman(11), Esfand(12)
                let persianMonth = month;
                let persianDay = day;
                
                // Simple approximation - for more accuracy, use the Python API
                // This is a basic fallback that gives approximate results
                return `${persianYear}/${persianMonth.toString().padStart(2, '0')}/${persianDay.toString().padStart(2, '0')}`;
            } catch (error) {
                console.error('Error in fallback date conversion:', error);
                return 'نامشخص';
            }
        }

        mapStatusToPersian(status) {
            const statusMap = {
                'done': 'انجام شده',
                'pending': 'در انتظار',
                'in_progress': 'در حال انجام'
            };
            
            return statusMap[status] || status || 'نامشخص';
        }

        // Get current chat_id
        getChatId() {
            return this.chatId;
        }

        // Reset chat session (useful for starting a new conversation)
        async resetChatSession() {
            this.chatId = null;
            this.messages = [];
            this.currentState = 'menu';
            this.selectedOption = null;
            
            // Clear messages container
            if (this.messagesContainer) {
                this.messagesContainer.innerHTML = '';
            }
            
            // Send welcome message again
            this.sendWelcomeMessage();
            
            console.log('🔄 Chat session reset');
        }

        // Get chat session info
        getChatSessionInfo() {
            return {
                chat_id: this.chatId,
                is_open: this.isOpen,
                current_state: this.currentState,
                message_count: this.messages.length
            };
        }

        // Expose chat_id to global scope for external access
        exposeChatId() {
            if (this.chatId) {
                window.currentChatId = this.chatId;
                console.log('🌐 Chat ID exposed to global scope:', this.chatId);
            }
        }

        addTimelineMenu() {
            const menuDiv = document.createElement('div');
            menuDiv.className = 'zeema-menu-items';
            
            const timelineMenuItem = document.createElement('div');
            timelineMenuItem.className = 'zeema-menu-item';
            timelineMenuItem.textContent = '1. مشاهده زمان بندی واریز سود ها';
            timelineMenuItem.addEventListener('click', () => this.handleTimelineClick());
            menuDiv.appendChild(timelineMenuItem);

            // Add return to main menu item
            const returnMenuItem = document.createElement('div');
            returnMenuItem.className = 'zeema-menu-item zeema-return-menu';
            returnMenuItem.textContent = 'بازگشت به منوی اصلی';
            returnMenuItem.addEventListener('click', () => this.handleMenuClick('بازگشت به منوی اصلی'));
            menuDiv.appendChild(returnMenuItem);

            this.messagesContainer.appendChild(menuDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }

        async handleTimelineClick() {
            if (!this.storedPlanIds || this.storedPlanIds.length === 0) {
                this.addMessage('❌ اطلاعات زمان‌بندی سرمایه گذاری برای این طرح یافت نشد.', 'bot');
                this.addReturnToMainMenu();
                return;
            }

            this.addMessage('1. مشاهده زمان بندی واریز سود ها', 'user');
            
            // Remove existing menu
            const existingMenu = this.messagesContainer.querySelector('.zeema-menu-items');
            if (existingMenu) {
                existingMenu.remove();
            }

            // Show loading message
            const loadingMessage = this.addMessage('📊 در حال بارگذاری زمان‌بندی واریز سودها...', 'bot');

            try {
                if (this.apiService && typeof this.apiService.get_plan_phase_timeline === 'function') {
                    console.log('Calling get_plan_phase_timeline API for plan IDs:', this.storedPlanIds);
                    const result = await this.apiService.get_plan_phase_timeline(this.storedPlanIds);
                    
                    // Remove loading message
                    if (loadingMessage) {
                        loadingMessage.remove();
                    }
                    
                    if (result.success && result.data && result.data.length > 0) {
                        // Sort data by start_date in ascending order
                        const sortedData = result.data.sort((a, b) => {
                            const dateA = new Date(a.start_date || '1900-01-01');
                            const dateB = new Date(b.start_date || '1900-01-01');
                            return dateA - dateB;
                        });

                        let message = '📅 زمان‌بندی واریز سودها:\n\n';
                        
                        // Process each item sequentially to handle async date conversion
                        for (const item of sortedData) {
                            const startDate = item.start_date ? await this.convertToSolarCalendar(item.start_date) : 'نامشخص';
                            const title = item.title || item.phase_name || 'نامشخص';
                            const planId = item.plan_id || 'نامشخص';
                            const percent = item.percent || item.percentage || 'نامشخص';
                            const status = this.mapStatusToPersian(item.status);
                            
                            // Get persian_confirmed_symbol from stored data
                            let persianConfirmedSymbol = 'نامشخص';
                            if (this.storedInvestedPlansData && this.storedInvestedPlansData.length > 0) {
                                const matchingPlan = this.storedInvestedPlansData.find(plan => 
                                    (plan['plans - plan_id'] || plan['transactions → plan_id']) === planId
                                );
                                if (matchingPlan) {
                                    persianConfirmedSymbol = matchingPlan['plans - plan_id → persian_confirmed_symbol'] || 'نامشخص';
                                }
                            }
                            
                            // Choose icon based on status
                            const statusIcon = item.status === 'done' ? '✅' : '🟦';
                            
                            message += `${statusIcon} ${startDate}\n`;
                            message += `🔹 ${title} / ${persianConfirmedSymbol}\n`;
                            message += `🔹 میزان سود: ${percent} درصد از کل مبلغ سرمایه گذاری\n`;
                            message += `🔹 وضعیت: ${status}\n\n`;
                        }
                        
                        this.addMessage(message, 'bot');
                    } else {
                        this.addMessage('❌ اطلاعات زمان‌بندی برای این طرح یافت نشد.', 'bot');
                    }
                } else {
                    // Remove loading message
                    if (loadingMessage) {
                        loadingMessage.remove();
                    }
                    this.addMessage('❌ سرویس API برای دریافت زمان‌بندی در دسترس نیست. لطفا با پشتیبانی تماس بگیرید.', 'bot');
                }
            } catch (error) {
                console.error('Error fetching timeline data:', error);
                
                // Remove loading message
                if (loadingMessage) {
                    loadingMessage.remove();
                }
                
                this.addMessage('❌ خطا در دریافت اطلاعات زمان‌بندی. لطفا دوباره تلاش کنید.', 'bot');
            }
            
            // Add return to main menu
            this.addReturnToMainMenu();
        }
    }

    // Initialize chatbot when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ZeemaChatbot());
    } else {
        new ZeemaChatbot();
    }
})(); 