# 🧪 Testing Guide - Smart Medical Health System

## Complete Testing Checklist

### Pre-Testing Setup

✅ **Before you start testing:**
1. MongoDB is running (`mongod` command)
2. Backend server is running (`npm start`)
3. All HTML files are accessible (use Live Server or open directly)
4. Clear browser cache and localStorage before fresh testing
5. Have Postman/Insomnia ready for API testing (optional)

---

## 1. 🔐 Authentication Testing

### Patient Registration
**Test Case 1: Successful Patient Registration**
```
Steps:
1. Open index.html
2. Click "Register" tab
3. Ensure "Patient" role is selected
4. Fill all fields:
   - Name: John Doe
   - Email: john@example.com
   - Password: Test123!
   - DOB: 1990-01-01
   - Blood Group: A+
   - Emergency Contact: 9876543210
   - Address: 123 Main St
5. Click "Register Patient"

Expected Result:
✅ Success message appears
✅ Unique Patient ID displayed (PAT-XXXXX format)
✅ Form resets
✅ ID can be copied for login

Common Issues:
❌ "Email already registered" - Use different email
❌ Connection error - Check if server is running
❌ Validation errors - Ensure all fields filled
```

**Test Case 2: Duplicate Email Registration**
```
Steps:
1. Try registering with same email twice

Expected Result:
✅ Error message: "Email already registered"
```

**Test Case 3: Invalid Input Validation**
```
Steps:
1. Try submitting with missing fields
2. Try invalid email format

Expected Result:
✅ Browser validation prevents submission
✅ Helpful error messages shown
```

### Hospital Registration
**Test Case 4: Successful Hospital Registration**
```
Steps:
1. Open index.html
2. Click "Register" tab
3. Select "Hospital" role
4. Fill all fields:
   - Hospital Name: City Hospital
   - Email: hospital@example.com
   - Password: Hospital123!
5. Click "Register Hospital"

Expected Result:
✅ Success message appears
✅ Unique Hospital ID displayed (HOSP-XXXXX format)
✅ ID can be saved for login
```

### Patient Login
**Test Case 5: Successful Patient Login**
```
Steps:
1. Open index.html
2. Ensure "Login" tab is active
3. Ensure "Patient" role is selected
4. Enter registered credentials:
   - Name: John Doe
   - Email: john@example.com
   - Patient ID: PAT-XXXXX (from registration)
5. Click "Login as Patient"

Expected Result:
✅ "Login successful! Redirecting..." message
✅ Redirects to patient-dashboard.html
✅ Dashboard loads with patient data
```

**Test Case 6: Failed Patient Login**
```
Steps:
1. Enter incorrect Patient ID or email

Expected Result:
✅ Error message: "Invalid credentials"
✅ No redirect occurs
```

### Hospital Login
**Test Case 7: Successful Hospital Login**
```
Steps:
1. Open index.html
2. Click "Login" tab
3. Select "Hospital" role
4. Enter hospital credentials
5. Click "Login as Hospital"

Expected Result:
✅ Redirects to hospital-dashboard.html
✅ Hospital dashboard loads correctly
```

---

## 2. 👤 Patient Dashboard Testing

### Dashboard Loading
**Test Case 8: Patient Dashboard Initial Load**
```
Steps:
1. Login as patient
2. Observe dashboard loading

Expected Result:
✅ Welcome message with patient name
✅ Patient info displayed correctly:
   - Patient ID
   - Email
   - Blood Group
   - Emergency Contact
   - Date of Birth
   - Address
✅ Medical history section appears
✅ AI chatbot interface visible
```

### Medical History
**Test Case 9: Empty Medical History**
```
Steps:
1. Login with newly registered patient
2. Check medical history section

Expected Result:
✅ Message: "No medical history found..."
✅ No visit cards displayed
```

**Test Case 10: Medical History with Records**
```
Prerequisites:
- Hospital must add visit records first

Steps:
1. Login as patient (after hospital adds records)
2. Check medical history section

Expected Result:
✅ Visit cards displayed with:
   - Hospital name
   - Visit date
   - Doctor name
   - Diagnosis
   - Prescription
   - Lab results (if any)
   - Download button
✅ Most recent visits shown first
```

### AI Summary Generator
**Test Case 11: Generate AI Summary (With Data)**
```
Prerequisites:
- Patient must have visit history

Steps:
1. Click "Generate AI Summary" button
2. Wait for summary generation

Expected Result:
✅ Summary box appears with:
   - Total hospital visits count
   - List of hospitals visited
   - Recent diagnoses
   - Current medications
   - Health status overview
   - Recommendations
```

**Test Case 12: Generate AI Summary (No Data)**
```
Steps:
1. Click "Generate AI Summary" on empty history

Expected Result:
✅ Alert: "No medical history available to summarize"
```

### Download Report
**Test Case 13: Download Medical Report**
```
Steps:
1. Click "Download Report" on any visit card
2. Check downloads folder

Expected Result:
✅ Text file downloaded
✅ Filename format: Medical_Report_VISIT-XXXXX.txt
✅ File contains:
   - Patient information
   - Visit details
   - Diagnosis
   - Prescription
   - Lab results
   - Generation timestamp
```

### AI Chatbot
**Test Case 14: Chatbot - Diet Query**
```
Steps:
1. Type in chatbot: "diet tips"
2. Press Send or Enter

Expected Result:
✅ Bot responds with diet recommendations
✅ Includes bullet points for:
   - Fruits and vegetables
   - Whole grains
   - Lean proteins
   - Water intake
```

**Test Case 15: Chatbot - Diabetes Query**
```
Steps:
1. Type: "diabetes management"
2. Send message

Expected Result:
✅ Bot responds with diabetes tips
✅ Includes monitoring, diet, exercise advice
```

**Test Case 16: Chatbot - Exercise Query**
```
Steps:
1. Type: "exercise recommendations"

Expected Result:
✅ Bot responds with exercise guidelines
✅ Mentions cardio, strength training, duration
```

**Test Case 17: Chatbot - Unknown Query**
```
Steps:
1. Type: "random question"

Expected Result:
✅ Bot responds with list of available topics
✅ Shows what it can help with
```

### Dark Mode
**Test Case 18: Toggle Dark Mode**
```
Steps:
1. Click "Dark Mode" button in navbar
2. Observe UI changes
3. Click again to toggle back

Expected Result:
✅ Background changes to dark
✅ Cards change to dark theme
✅ Text colors adjust for readability
✅ Button text changes to "Light Mode"
✅ Preference saved (check by refreshing)
```

---

## 3. 🏥 Hospital Dashboard Testing

### Dashboard Loading
**Test Case 19: Hospital Dashboard Initial Load**
```
Steps:
1. Login as hospital
2. Observe dashboard

Expected Result:
✅ Hospital name in navbar
✅ Four statistics cards displayed:
   - Total Patients
   - Total Visits
   - Blood Types Available
   - Critical Stock Alerts
✅ Three tabs visible:
   - Search Patients
   - Add Visit Record
   - Blood Bank
```

### Patient Search
**Test Case 20: Search Patient - Found**
```
Steps:
1. Click "Search Patients" tab
2. Enter valid Patient ID (PAT-XXXXX)
3. Click "Search"

Expected Result:
✅ Patient information card appears with:
   - Name
   - Patient ID
   - Email
   - Blood Group
   - Date of Birth
   - Emergency Contact
   - Address
✅ Previous visits section shows:
   - All previous hospital visits
   - Visit details
   - Chronological order
```

**Test Case 21: Search Patient - Not Found**
```
Steps:
1. Enter invalid Patient ID
2. Click "Search"

Expected Result:
✅ Error message: "Patient not found"
✅ Red colored message box
```

**Test Case 22: Search Empty ID**
```
Steps:
1. Leave search field empty
2. Click "Search"

Expected Result:
✅ Alert: "Please enter a Patient ID"
```

### Add Visit Record
**Test Case 23: Add Visit - Successful**
```
Steps:
1. Click "Add Visit Record" tab
2. Fill all required fields:
   - Patient ID: PAT-XXXXX (existing patient)
   - Doctor Name: Dr. Smith
   - Diagnosis: Viral Fever
   - Prescription: Paracetamol 500mg
3. Optionally fill:
   - Lab Results: Blood test normal
   - Additional Notes: Rest advised
4. Click "Add Visit Record"

Expected Result:
✅ Green success message appears
✅ Form resets
✅ Record saved to database
✅ Appears in patient's history immediately
```

**Test Case 24: Add Visit - Invalid Patient ID**
```
Steps:
1. Enter non-existent Patient ID
2. Fill other fields
3. Submit form

Expected Result:
✅ Error message shown
✅ Record not saved
```

**Test Case 25: Add Visit - Missing Required Fields**
```
Steps:
1. Leave required fields empty
2. Try to submit

Expected Result:
✅ Browser validation prevents submission
✅ Fields marked as required
```

### Blood Bank Management
**Test Case 26: View Blood Bank**
```
Steps:
1. Click "Blood Bank" tab
2. Observe blood type cards

Expected Result:
✅ Eight blood type cards displayed:
   A+, A-, B+, B-, AB+, AB-, O+, O-
✅ Each card shows:
   - Blood type
   - Available units
   - Update input field
   - Update button
```

**Test Case 27: Update Blood Stock - Normal**
```
Steps:
1. In blood bank tab
2. Select any blood type (e.g., A+)
3. Enter units: 50
4. Click "Update"

Expected Result:
✅ Units updated immediately
✅ Display shows new count: 50
✅ No critical alert
✅ Input field clears
```

**Test Case 28: Update Blood Stock - Critical Level**
```
Steps:
1. Select any blood type
2. Enter units: 5 (less than 10)
3. Click "Update"

Expected Result:
✅ Units updated to 5
✅ Card shows red border
✅ "Critical Stock" warning appears
✅ Alert notification shown
✅ Card has pulsing animation
✅ Critical Stock count increases in stats
```

**Test Case 29: Blood Stock - Real-time Alert**
```
Prerequisites:
- Have two hospital dashboard tabs open

Steps:
1. In first tab, update blood stock to critical level
2. Observe second tab

Expected Result:
✅ Second tab receives real-time alert
✅ Critical stock notification appears
✅ Both dashboards show updated status
```

### Emergency Alert System
**Test Case 30: Send Emergency Alert**
```
Steps:
1. Click "Send Alert" button in navbar
2. Modal window opens
3. Enter message: "Emergency blood needed - Type O-"
4. Click "Send Alert to All Hospitals"

Expected Result:
✅ Confirmation alert shown
✅ Message field clears
✅ Modal closes
```

**Test Case 31: Receive Emergency Alert**
```
Prerequisites:
- Have multiple hospital tabs open

Steps:
1. Send emergency alert from one hospital
2. Check other hospital tabs

Expected Result:
✅ Alert appears in red notification box
✅ Shows hospital name that sent alert
✅ Shows message content
✅ Shows timestamp
✅ Alert visible to all connected hospitals
```

---

## 4. 🔄 Integration Testing

### End-to-End Patient Journey
**Test Case 32: Complete Patient Workflow**
```
Steps:
1. Register as new patient
2. Save Patient ID
3. Login with credentials
4. View empty dashboard
5. Hospital adds visit record
6. Refresh patient dashboard
7. View medical history
8. Generate AI summary
9. Download report
10. Chat with AI assistant
11. Toggle dark mode
12. Logout

Expected Result:
✅ All steps work seamlessly
✅ Data persists correctly
✅ No errors encountered
```

### End-to-End Hospital Journey
**Test Case 33: Complete Hospital Workflow**
```
Steps:
1. Register as new hospital
2. Save Hospital ID
3. Login with credentials
4. View empty statistics
5. Search for patient
6. Add new visit record
7. Update blood bank stock
8. Create critical stock alert
9. Send emergency alert
10. Receive alert from another hospital
11. Toggle dark mode
12. Logout

Expected Result:
✅ All operations successful
✅ Real-time features working
✅ Data synchronized
```

---

## 5. 🔒 Security Testing

**Test Case 34: Unauthorized Access - Patient Dashboard**
```
Steps:
1. Clear localStorage
2. Try to access patient-dashboard.html directly

Expected Result:
✅ Redirected to index.html
✅ Cannot access without login
```

**Test Case 35: Unauthorized Access - Hospital Dashboard**
```
Steps:
1. Clear localStorage
2. Try to access hospital-dashboard.html directly

Expected Result:
✅ Redirected to index.html
✅ Authentication required
```

**Test Case 36: Cross-Role Access Prevention**
```
Steps:
1. Login as patient
2. Try to manually navigate to hospital-dashboard.html
3. Or vice versa

Expected Result:
✅ Redirected to appropriate dashboard
✅ Role-based access enforced
```

**Test Case 37: Token Expiration**
```
Steps:
1. Login successfully
2. Wait 24 hours (or modify JWT expiry for testing)
3. Try to use the application

Expected Result:
✅ API calls fail with 403 error
✅ User redirected to login
```

---

## 6. 📱 Responsive Design Testing

**Test Case 38: Mobile View (375px)**
```
Steps:
1. Open in Chrome DevTools
2. Set device to iPhone X
3. Test all pages

Expected Result:
✅ All elements visible
✅ No horizontal scroll
✅ Touch targets adequate size
✅ Forms usable on mobile
```

**Test Case 39: Tablet View (768px)**
```
Steps:
1. Set device to iPad
2. Test all functionality

Expected Result:
✅ Layout adjusts appropriately
✅ All features accessible
✅ Statistics cards stack properly
```

**Test Case 40: Desktop View (1920px)**
```
Steps:
1. Test on full desktop resolution

Expected Result:
✅ Maximum width enforced (1400px)
✅ Proper spacing and alignment
✅ All features visible without crowding
```

---

## 7. 🌐 Browser Compatibility Testing

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

**Test Case 41: Cross-Browser Functionality**
```
Steps:
1. Open application in each browser
2. Test core features:
   - Registration
   - Login
   - Dashboard features
   - Real-time updates

Expected Result:
✅ Consistent functionality across browsers
✅ UI renders correctly
✅ Socket.io connections work
```

---

## 8. ⚡ Performance Testing

**Test Case 42: Page Load Time**
```
Steps:
1. Clear cache
2. Open index.html
3. Measure load time

Expected Result:
✅ Page loads in < 2 seconds
✅ No console errors
```

**Test Case 43: Large Data Handling**
```
Steps:
1. Create patient with 50+ visit records
2. Load patient dashboard
3. Observe performance

Expected Result:
✅ Dashboard loads smoothly
✅ No lag when scrolling
✅ All records display correctly
```

---

## 9. 🐛 Error Handling Testing

**Test Case 44: Network Error Simulation**
```
Steps:
1. Stop backend server
2. Try any API operation

Expected Result:
✅ User-friendly error message
✅ No application crash
✅ Helpful guidance provided
```

**Test Case 45: Invalid API Response**
```
Steps:
1. Modify API response format
2. Observe application behavior

Expected Result:
✅ Graceful error handling
✅ User notified appropriately
```

---

## 10. 📊 Data Persistence Testing

**Test Case 46: Data Persistence After Logout**
```
Steps:
1. Add visit records
2. Update blood bank
3. Logout
4. Login again

Expected Result:
✅ All data still present
✅ No data loss
✅ Correct data displayed
```

**Test Case 47: Data Consistency Across Sessions**
```
Steps:
1. Login on multiple devices
2. Make changes on one device
3. Refresh other devices

Expected Result:
✅ Changes reflected everywhere
✅ Data synchronized
```

---

## Testing Tools & Commands

### Manual Testing
```bash
# Start MongoDB
mongod

# Start Backend (Terminal 1)
npm start

# Check server logs for errors
# Look for "MongoDB Connected Successfully"
# Look for "Server running on port 5000"
```

### Browser Console Testing
```javascript
// Check if user is logged in
console.log(localStorage.getItem('token'));
console.log(localStorage.getItem('userRole'));
console.log(localStorage.getItem('userData'));

// Check Socket.io connection
// In browser console, you should see:
// "New client connected: [socket-id]"

// Clear localStorage for fresh testing
localStorage.clear();
```

### MongoDB Testing
```bash
# Open MongoDB shell
mongo

# Select database
use medical_health_system

# Check collections
show collections

# Count users
db.users.count()

# View recent users
db.users.find().limit(5)

# View all visits
db.hospitalvisits.find()

# Clear all data (CAUTION!)
db.users.deleteMany({})
db.hospitals.deleteMany({})
db.hospitalvisits.deleteMany({})
db.bloodbanks.deleteMany({})
```

---

## Bug Reporting Template

When you find a bug, report it using this format:

```
**Bug Title**: [Short description]

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Result**:
What should happen

**Actual Result**:
What actually happened

**Screenshots**:
[Attach if applicable]

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Screen size: 1920x1080

**Console Errors**:
[Paste any console errors]
```

---

## Test Report Summary

After completing all tests, create a summary:

```
✅ Passed: XX / 47 tests
❌ Failed: XX / 47 tests
⏭️ Skipped: XX / 47 tests

Critical Issues: X
High Priority: X
Medium Priority: X
Low Priority: X

Overall Status: PASS / FAIL
Ready for Deployment: YES / NO

Notes:
[Any additional observations]
```

---

## Automated Testing (Future Enhancement)

Consider adding:
- Jest for unit testing
- Cypress for E2E testing
- Postman collections for API testing
- Load testing with Artillery

---

**Happy Testing! 🎉**

Remember: Good testing leads to robust applications!