# Social Media Menu Implementation

## Overview
This document describes the implementation of the social media menu functionality for the Zeema chatbot. When users select "۴. اطلاع رسانی از طرح های جدید زیما", they now see a message and a menu with social media links.

## Changes Made

### 1. Updated Response Message
**Files Modified:** `chatbot.js`, `deploy.js`

**Old Response:**
```
"برای اطلاع از طرح‌های جدید، لطفا شماره موبایل خود را وارد کنید تا از آخرین اخبار و طرح‌ها مطلع شوید."
```

**New Response:**
```
"کاربر عزیز برای اطلاع رسانی از طرح های جدید زیما میتوانید ما را در شبکه های اجتماعی زیر دنبال کنید.\nاطلاع رسانی طرح های جدید تنها در کانال های زیر انجام خواهد شد"
```

### 2. Added CSS Styles
**Files Modified:** `chatbot.js`, `deploy.js`

Added new CSS class `.zeema-social-menu-item` with:
- Gradient background (purple to blue)
- Hover effects with scale and shadow
- Shimmer animation effect
- Responsive design

### 3. Added Social Media Menu Method
**Files Modified:** `chatbot.js`, `deploy.js`

Added `addSocialMediaMenu()` method that creates:
- Three social media menu items:
  1. کانال بله - http://ble.ir/Zeemacrowd
  2. کانال تلگرام - http://t.me/zeemacrowd
  3. پیج اینستاگرام - http://instagram.com/zeema.fund
- Return to main menu option
- Click handlers that open links in new tabs
- User feedback messages

### 4. Updated Menu Handler
**Files Modified:** `chatbot.js`, `deploy.js`

Modified `handleMenuClick()` method to:
- Detect when "۴. اطلاع رسانی از طرح های جدید زیما" is selected
- Set state to 'social_media_menu'
- Display the response message
- Show social media menu after a 500ms delay

## Social Media Links

| Platform | Label | URL |
|----------|-------|-----|
| Bale | کانال بله | http://ble.ir/Zeemacrowd |
| Telegram | کانال تلگرام | http://t.me/zeemacrowd |
| Instagram | پیج اینستاگرام | http://instagram.com/zeema.fund |

## User Experience Flow

1. User clicks on "۴. اطلاع رسانی از طرح های جدید زیما"
2. Bot displays the informational message
3. Social media menu appears with 3 options
4. User clicks on any social media option
5. Link opens in new tab
6. Bot shows confirmation message
7. Return to main menu option appears

## Testing

A test file `test_social_media_menu.html` has been created to verify the functionality. The test page includes:
- Instructions for testing
- Expected behavior description
- Direct links to social media platforms for verification

## Files Modified

1. **chatbot.js** - Main chatbot implementation
2. **deploy.js** - Deployment version of chatbot
3. **test_social_media_menu.html** - Test page for verification

## Browser Compatibility

The implementation uses standard web APIs:
- `window.open()` for opening links in new tabs
- CSS3 animations and gradients
- Modern JavaScript features

Compatible with all modern browsers including:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Notes

- All links open in new tabs (`_blank` target)
- User gets immediate feedback when clicking social media options
- The menu has a modern, attractive design with gradient backgrounds
- Hover effects provide good user interaction feedback
- The implementation is consistent across both `chatbot.js` and `deploy.js` 