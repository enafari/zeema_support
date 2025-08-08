// Utility functions for Zeema Chatbot

/**
 * Convert Gregorian date to Solar (Persian) calendar using Python jalaali library
 * @param {string} gregorianDate - Date in format 'YYYY-MM-DD' or ISO string
 * @returns {Promise<string>} - Promise that resolves to date in Solar calendar format 'YYYY/MM/DD'
 */
async function convertToSolarCalendar(gregorianDate) {
    try {
        // Use Python date converter API if available
        const response = await fetch(`http://localhost:8001/api/convert_date?date=${encodeURIComponent(gregorianDate)}`);
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                return data.solar_date;
            } else {
                console.error('Date conversion API error:', data.message);
                return 'نامشخص';
            }
        } else {
            console.error('Date conversion API not available, using fallback');
            return convertToSolarCalendarFallback(gregorianDate);
        }
    } catch (error) {
        console.error('Error calling date conversion API:', error);
        return convertToSolarCalendarFallback(gregorianDate);
    }
}

/**
 * Fallback date conversion function (basic implementation)
 * @param {string} gregorianDate - Date in format 'YYYY-MM-DD' or ISO string
 * @returns {string} - Date in Solar calendar format 'YYYY/MM/DD'
 */
function convertToSolarCalendarFallback(gregorianDate) {
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
 * @returns {Promise<string>} - Promise that resolves to formatted message
 */
async function formatPlanPhaseMessage(planPhases) {
    if (!planPhases || planPhases.length === 0) {
        return 'هیچ مرحله‌ای برای این طرح یافت نشد.';
    }
    
    let message = 'جزئیات پرداخت سود طرح:\n\n';
    
    // Process phases sequentially to handle async date conversion
    for (const phase of planPhases) {
        const title = phase.title || phase.phase_name || 'نامشخص';
        const startDate = phase.start_date ? await convertToSolarCalendar(phase.start_date) : 'نامشخص';
        const percent = phase.percent || phase.percentage || 'نامشخص';
        const status = mapStatusToPersian(phase.status);
        
        message += `⚪️ ${title}\n`;
        message += `▪️ تاریخ: ${startDate}\n`;
        message += `▪️ میزان سود: ${percent} درصد\n`;
        message += `▪️ وضعیت: ${status}\n\n`;
    }
    
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