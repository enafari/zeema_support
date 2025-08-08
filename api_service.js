// Zeema API Service for Supabase
class ZeemaAPIService {
    constructor() {
        this.supabaseUrl = 'https://woobghuekrbzilcdmijv.supabase.co';
        this.apiKey = 'sb_publishable_H0UBKWC3vpPfBIFkTBKWgQ_Xxd28nG8';
        this.baseHeaders = {
            'apikey': this.apiKey,
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Get invested plans by national ID
    async get_invested_plans(nationalId) {
        try {
            console.log(`🔍 Fetching invested plans for national ID: ${nationalId}`);
            
            // Validate input
            if (!nationalId || typeof nationalId !== 'string' || nationalId.trim() === '') {
                throw new Error('Invalid national ID provided');
            }
            
            // Clean the national ID (remove leading zeros if needed)
            const cleanNationalId = nationalId.trim();
            console.log(`🧹 Cleaned national ID: ${cleanNationalId}`);
            
            // First try: Check if table exists and get sample data
            console.log('📋 Step 1: Checking table structure...');
            const tableCheck = await fetch(`${this.supabaseUrl}/rest/v1/invested_plans_by_users?select=*&limit=1`, {
                method: 'GET',
                headers: this.baseHeaders,
                mode: 'cors'
            });
            
            console.log('Table check status:', tableCheck.status);
            console.log('Table check headers:', Object.fromEntries(tableCheck.headers.entries()));
            
            if (!tableCheck.ok) {
                const errorText = await tableCheck.text();
                console.error('Table check failed:', errorText);
                throw new Error(`Table access failed: ${tableCheck.status} - ${errorText}`);
            }
            
            const sampleData = await tableCheck.json();
            console.log('Sample data structure:', sampleData);
            
            // Second try: Query with the actual national ID
            console.log('🔍 Step 2: Querying with national ID...');
            const queryUrl = `${this.supabaseUrl}/rest/v1/invested_plans_by_users?national_id=eq.${encodeURIComponent(cleanNationalId)}&select=*`;
            console.log('Query URL:', queryUrl);
            
            const response = await fetch(queryUrl, {
                method: 'GET',
                headers: this.baseHeaders,
                mode: 'cors'
            });
            
            console.log('Query response status:', response.status);
            console.log('Query response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Query failed:', errorText);
                
                // Try alternative query format
                console.log('🔄 Step 3: Trying alternative query format...');
                const altQueryUrl = `${this.supabaseUrl}/rest/v1/invested_plans_by_users?select=*&national_id=eq.${encodeURIComponent(cleanNationalId)}`;
                console.log('Alternative query URL:', altQueryUrl);
                
                const altResponse = await fetch(altQueryUrl, {
                    method: 'GET',
                    headers: this.baseHeaders,
                    mode: 'cors'
                });
                
                console.log('Alternative query status:', altResponse.status);
                
                if (!altResponse.ok) {
                    const altErrorText = await altResponse.text();
                    console.error('Alternative query also failed:', altErrorText);
                    throw new Error(`HTTP error! status: ${altResponse.status}, details: ${altErrorText}`);
                }
                
                const data = await altResponse.json();
                console.log('✅ Alternative query successful, data:', data);
                
                return {
                    success: true,
                    data: data,
                    message: data.length > 0 ? 'Data retrieved successfully' : 'No data found for this national ID'
                };
            }
            
            const data = await response.json();
            console.log('✅ Query successful, data:', data);
            
            return {
                success: true,
                data: data,
                message: data.length > 0 ? 'Data retrieved successfully' : 'No data found for this national ID'
            };
            
        } catch (error) {
            console.error('❌ Error fetching invested plans:', error);
            
            // Provide more detailed error information
            let errorMessage = error.message;
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'Network error - please check your internet connection';
            } else if (error.message.includes('CORS')) {
                errorMessage = 'CORS error - please check browser settings';
            }
            
            return {
                success: false,
                data: null,
                message: `Error: ${errorMessage}`,
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            };
        }
    }

    // Get plan phases by plan ID
    async get_plan_phase(planId) {
        try {
            console.log(`🔍 Fetching plan phases for plan ID: ${planId}`);
            
            // Validate input
            if (!planId || typeof planId !== 'string' && typeof planId !== 'number') {
                throw new Error('Invalid plan ID provided');
            }
            
            // Convert to string and clean the plan ID
            const cleanPlanId = String(planId).trim();
            console.log(`🧹 Cleaned plan ID: ${cleanPlanId}`);
            
            // Query the plan_phase table
            console.log('📋 Querying plan_phase table...');
            const queryUrl = `${this.supabaseUrl}/rest/v1/plan_phase?plan_id=eq.${encodeURIComponent(cleanPlanId)}&select=*`;
            console.log('Query URL:', queryUrl);
            
            const response = await fetch(queryUrl, {
                method: 'GET',
                headers: this.baseHeaders,
                mode: 'cors'
            });
            
            console.log('Query response status:', response.status);
            console.log('Query response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Query failed:', errorText);
                
                // Try alternative query format
                console.log('🔄 Trying alternative query format...');
                const altQueryUrl = `${this.supabaseUrl}/rest/v1/plan_phase?select=*&plan_id=eq.${encodeURIComponent(cleanPlanId)}`;
                console.log('Alternative query URL:', altQueryUrl);
                
                const altResponse = await fetch(altQueryUrl, {
                    method: 'GET',
                    headers: this.baseHeaders,
                    mode: 'cors'
                });
                
                console.log('Alternative query status:', altResponse.status);
                
                if (!altResponse.ok) {
                    const altErrorText = await altResponse.text();
                    console.error('Alternative query also failed:', altErrorText);
                    throw new Error(`HTTP error! status: ${altResponse.status}, details: ${altErrorText}`);
                }
                
                const data = await altResponse.json();
                console.log('✅ Alternative query successful, data:', data);
                
                return {
                    success: true,
                    data: data,
                    message: data.length > 0 ? 'Plan phases retrieved successfully' : 'No plan phases found for this plan ID'
                };
            }
            
            const data = await response.json();
            console.log('✅ Query successful, data:', data);
            
            return {
                success: true,
                data: data,
                message: data.length > 0 ? 'Plan phases retrieved successfully' : 'No plan phases found for this plan ID'
            };
            
        } catch (error) {
            console.error('❌ Error fetching plan phases:', error);
            
            // Provide more detailed error information
            let errorMessage = error.message;
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'Network error - please check your internet connection';
            } else if (error.message.includes('CORS')) {
                errorMessage = 'CORS error - please check browser settings';
            }
            
            return {
                success: false,
                data: null,
                message: `Error: ${errorMessage}`,
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            };
        }
    }

    // Format data for display
    formatInvestedPlansData(data) {
        if (!data || data.length === 0) {
            return 'No invested plans found for this national ID.';
        }

        const userData = data[0];
        const transactions = userData.transactions || [];
        const plans = userData.plans || [];

        let response = `📊 اطلاعات طرح‌های سرمایه‌گذاری:\n\n`;
        response += `👤 نام: ${userData.first_name || 'نامشخص'} ${userData.last_name || 'نامشخص'}\n`;
        response += `📈 تعداد طرح‌ها: ${transactions.length}\n\n`;
        
        if (transactions.length > 0) {
            response += `📋 لیست طرح‌های سرمایه‌گذاری شده:\n`;
            transactions.forEach((transaction, index) => {
                const plan = plans.find(p => p.plan_id === transaction.plan_id);
                const planName = plan ? plan.persian_confirmed_symbol : 'نامشخص';
                response += `${index + 1}. ${planName}\n`;
            });
        } else {
            response += `❌ هیچ طرح سرمایه‌گذاری‌ای یافت نشد.\n`;
        }

        return response;
    }
}

// Export for use in other files
window.ZeemaAPIService = ZeemaAPIService; 