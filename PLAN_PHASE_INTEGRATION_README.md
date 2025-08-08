# Plan Phase Integration - Zeema Chatbot

This document describes the implementation of plan phase integration in the Zeema Chatbot, where users can select plans and view detailed phase information.

## 🎯 Overview

The integration allows users to:
1. View their invested plans from `get_invested_plans` API
2. Select a plan from the menu (sending `plan_id` instead of `plan_symbol`)
3. View detailed plan phase information from `get_plan_phase` API
4. See formatted messages with Solar calendar dates and Persian status text
5. Navigate through phase menus for further details

## 🔧 Implementation Details

### 1. Menu System Changes

**Before:**
- Menu items displayed `plan_symbol`
- Clicking sent `plan_symbol` text to backend

**After:**
- Menu items display `plan_title` (more user-friendly)
- Clicking sends `plan_id` to backend for API calls
- Plan IDs are extracted from API response data

### 2. API Integration

#### `get_invested_plans` API
- Returns user's invested plans with plan details
- Extracts both plan titles and plan IDs for menu creation
- Plan IDs are used for subsequent `get_plan_phase` calls

#### `get_plan_phase` API
- Called when user selects a plan from menu
- Uses `plan_id` as input parameter
- Returns array of plan phases with details

### 3. Message Formatting

The response message follows this format:

```
جزئیات پرداخت سود طرح:

⚪️ [title]
▪️ تاریخ: [start_date in Solar calendar]
▪️ میزان سود: [percent] درصد
▪️ وضعیت: [status in Persian]

⚪️ [title]
▪️ تاریخ: [start_date in Solar calendar]
▪️ میزان سود: [percent] درصد
▪️ وضعیت: [status in Persian]

اگر تاریخ واریز سودتان امروز است پرداختتان در حال پردازش است و چون شبا میشود طی ۲۴ ساعت آینده به حسابتان واریز خواهد شد.
جهت بررسی جزئیات تراکنش هر مرحله سود روی آن کلیک کنید
```

### 4. Date Conversion

- Gregorian dates are converted to Solar (Persian) calendar
- Format: `YYYY/MM/DD`
- Example: `2024-01-15` → `1403/01/15`

### 5. Status Mapping

| English Status | Persian Status |
|----------------|----------------|
| `done` | `انجام شده` |
| `pending` | `در انتظار` |
| `in_progress` | `در حال انجام` |

## 📁 Files Modified

### 1. `utils.js` (New)
Utility functions for:
- Solar calendar date conversion
- Status mapping to Persian
- Plan phase message formatting

### 2. `chatbot.js`
- Modified `addPlansMenu()` to accept plan IDs
- Updated `handlePlanClick()` to call `get_plan_phase` API
- Added `addPhaseMenu()` for phase selection
- Added `formatPlanPhaseMessage()` for message formatting
- Added date conversion and status mapping methods

### 3. `deploy.js`
- Same changes as `chatbot.js`
- Updated for production deployment

### 4. `test_plan_phase_integration.html` (New)
Comprehensive test page for:
- Full integration flow testing
- Individual API testing
- Utility function testing
- Date conversion testing
- Status mapping testing

## 🔄 Flow Diagram

```
User enters National ID
         ↓
get_invested_plans API
         ↓
Display plan list with titles
         ↓
User selects plan (plan_id sent)
         ↓
get_plan_phase API
         ↓
Format response with:
- Solar calendar dates
- Persian status text
- Phase menu
         ↓
User can select phases for details
```

## 🧪 Testing

### Test Page
Open `test_plan_phase_integration.html` to test:

1. **Full Flow Test**: Complete integration test
2. **Get Invested Plans Test**: API functionality
3. **Get Plan Phase Test**: API functionality
4. **Date Conversion Test**: Utility functions
5. **Status Mapping Test**: Utility functions

### Manual Testing
1. Open chatbot
2. Select "۲. اطلاعات طرح های سرمایه گذاری شده من"
3. Enter national ID (e.g., `0372829163`)
4. Select a plan from the menu
5. Verify plan phase details are displayed
6. Check date conversion and status mapping

## 📊 API Response Examples

### get_invested_plans Response
```json
{
  "success": true,
  "data": [
    {
      "plans - plan_id": "123",
      "plans - plan_id → title": "طرح سرمایه گذاری طلا",
      "plans - plan_id → persian_confirmed_symbol": "زیما طلا",
      "transactions → amount": "1000000"
    }
  ]
}
```

### get_plan_phase Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "plan_id": "123",
      "title": "مرحله اول",
      "start_date": "2024-01-15",
      "percent": 8,
      "status": "done"
    },
    {
      "id": 2,
      "plan_id": "123",
      "title": "مرحله دوم",
      "start_date": "2024-02-15",
      "percent": 10,
      "status": "pending"
    }
  ]
}
```

## 🎨 UI/UX Features

### Menu Styling
- Plan items: Green background with hover effects
- Phase items: Same styling as plan items
- Return button: Gray background with italic text

### Loading States
- Loading animation during API calls
- Loading message: "در حال بارگذاری جزئیات..."
- Error handling with user-friendly messages

### Responsive Design
- Mobile-friendly menu layout
- Proper RTL text direction
- Consistent styling with existing chatbot

## 🔧 Configuration

### API Endpoints
- `get_invested_plans`: `invested_plans_by_users` table
- `get_plan_phase`: `plan_phase` table

### Required Fields
- Plan data: `plan_id`, `title`, `persian_confirmed_symbol`
- Phase data: `title`, `start_date`, `percent`, `status`

### Error Handling
- Network errors: "خطا در اتصال به سرور"
- No data: "اطلاعاتی برای این طرح یافت نشد"
- Invalid input: "لطفا دوباره تلاش کنید"

## 🚀 Deployment

1. Include `utils.js` before other scripts
2. Update `chatbot.js` and `deploy.js`
3. Test with `test_plan_phase_integration.html`
4. Verify API endpoints are accessible
5. Check date conversion accuracy
6. Validate status mapping

## 📝 Notes

- Date conversion is approximate (year - 621)
- For production, consider using a proper Persian calendar library
- Status mapping can be extended for additional statuses
- Phase menu can be enhanced with transaction details
- Error handling can be improved with retry mechanisms 