// Utility functions for Zeema Chatbot

/**
 * Convert Gregorian date to Solar (Persian) calendar
 * @param {string} gregorianDate - Date in format 'YYYY-MM-DD' or ISO string
 * @returns {string} - Date in Solar calendar format 'YYYY/MM/DD'
 */
function convertToSolarCalendar(gregorianDate) {
    try {
        const date = new Date(gregorianDate);
        if (isNaN(date.getTime())) {
            return 'نامشخص';
        }
        
        // Simple conversion - for production use a proper Persian calendar library
        // This is a basic implementation
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // Convert to Persian year (approximate)
        const persianYear = year - 621;
        
        // Format as YYYY/MM/DD
        return `${persianYear}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    } catch (error) {
        console.error('Error converting date to Solar calendar:', error);
        return 'نامشخص';
    }
}

/**
 * Map status values to Persian text
 * @param {string} status - Status value from API
 * @returns {string} - Persian status text
 */
function mapStatusToPersian(status) {
    const statusMap = {
        'done': 'انجام شده',
        'pending': 'در انتظار',
        'in_progress': 'در حال انجام'
    };
    
    return statusMap[status] || status || 'نامشخص';
}

/**
 * Format plan phase data for display
 * @param {Array} planPhases - Array of plan phase objects
 * @returns {string} - Formatted message
 */
function formatPlanPhaseMessage(planPhases) {
    if (!planPhases || planPhases.length === 0) {
        return 'هیچ مرحله‌ای برای این طرح یافت نشد.';
    }
    
    let message = 'جزئیات پرداخت سود طرح:\n\n';
    
    planPhases.forEach((phase, index) => {
        const title = phase.title || phase.phase_name || 'نامشخص';
        const startDate = phase.start_date ? convertToSolarCalendar(phase.start_date) : 'نامشخص';
        const percent = phase.percent || phase.percentage || 'نامشخص';
        const status = mapStatusToPersian(phase.status);
        
        message += `⚪️ ${title}\n`;
        message += `▪️ تاریخ: ${startDate}\n`;
        message += `▪️ میزان سود: ${percent} درصد\n`;
        message += `▪️ وضعیت: ${status}\n\n`;
    });
    
    message += 'اگر تاریخ واریز سودتان امروز است پرداختتان در حال پردازش است و چون شبا میشود طی ۲۴ ساعت آینده به حسابتان واریز خواهد شد.\n';
    message += 'جهت بررسی جزئیات تراکنش هر مرحله سود روی آن کلیک کنید';
    
    return message;
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertToSolarCalendar,
        mapStatusToPersian,
        formatPlanPhaseMessage
    };
} else {
    // Make functions globally available
    window.ZeemaUtils = {
        convertToSolarCalendar,
        mapStatusToPersian,
        formatPlanPhaseMessage
    };
} 