# Quick Testing Guide - Firestore Fix

## 🧪 How to Test the Fix

### Test 1: New Email Signup ✅

1. Open app in incognito/private window
2. Click "Sign Up"
3. Enter email and password
4. Click "Sign Up" button
5. **Expected**: Success message about verification email
6. Check email and click verification link
7. Return to app and login with same credentials
8. **Expected**:
   - Onboarding wizard appears
   - No Firestore errors in console
   - Can complete onboarding
   - Dashboard loads successfully
9. **Verify in Firebase Console**:
   - User exists in Authentication
   - User document exists in Firestore under `/users/{uid}`
   - Document has all required fields

### Test 2: Google OAuth Signup ✅

1. Open app in incognito/private window
2. Click "Or continue with Google"
3. Select Google account
4. **Expected**:
   - Onboarding wizard appears for first-time users
   - No errors in console
   - Can complete onboarding
   - Dashboard loads
5. **Verify in Firebase Console**:
   - User in Authentication (Google provider)
   - Firestore document created

### Test 3: Existing User Login ✅

1. Use account from Test 1 or Test 2
2. Log out if logged in
3. Log in again with email/password or Google
4. **Expected**:
   - No onboarding (already completed)
   - Dashboard loads with saved data
   - No permission errors

### Test 4: Dashboard with No Data ✅

1. Complete Test 1 to create new user
2. Complete onboarding with minimal data
3. Check dashboard shows:
   - ✅ Countdown card (even if no exam date)
   - ✅ Progress at 0%
   - ✅ Streak at 0 days
   - ✅ No JavaScript errors
   - ✅ Can add custom subjects

### Test 5: Dashboard with Full Data ✅

1. Login as existing user with data
2. Verify:
   - ✅ All subjects/papers visible
   - ✅ Progress calculated correctly
   - ✅ Can toggle checkboxes
   - ✅ Streak updates work
   - ✅ Settings panel functional

## 🔍 What to Look For

### ✅ Success Indicators

- No "Missing or insufficient permissions" error
- No "Cannot read property 'map' of undefined" errors
- No NaN values in countdown or progress
- Firestore document created for every new user
- Smooth transition from onboarding to dashboard

### ❌ Red Flags

- Console errors mentioning Firestore
- Blank white screen after login
- "Loading..." that never finishes
- Missing user document in Firestore
- Any undefined/null errors

## 🐛 Common Issues & Fixes

### Issue: "Missing or insufficient permissions"

**Cause**: User document doesn't exist
**Fix**: Implemented in AuthContext.tsx - auto-creates document
**Test**: Sign up new user and verify document created

### Issue: Dashboard crashes with "cannot map"

**Cause**: customSubjects or other arrays are undefined
**Fix**: Added optional chaining throughout components
**Test**: Access dashboard immediately after onboarding

### Issue: NaN in countdown

**Cause**: Invalid or empty targetExam date
**Fix**: Added validation in CountdownCard.tsx
**Test**: Complete onboarding without setting exam date

### Issue: Onboarding loops forever

**Cause**: Document exists but missing required fields
**Fix**: Check for targetExam field specifically
**Test**: Login with partially complete user data

## 📊 Firebase Console Checks

### After Each New Signup:

1. Open Firebase Console → Authentication
2. Verify user appears in list
3. Open Firestore → users collection
4. Find document with matching UID
5. Verify document contains:
   ```
   {
     email: "user@example.com",
     displayName: "Student",
     course: "Other" (or selected course),
     level: "Not Applicable" (or selected level),
     targetExam: "" (or selected date),
     groups: [],
     progress: {},
     customSubjects: [],
     studyStreak: {
       current: 0,
       lastCheckedDate: ""
     },
     createdAt: "2025-11-17T..."
   }
   ```

## 🚀 Quick Commands

### Development Testing

```bash
cd "c:\Users\Anuj Sharma\Desktop\Study tracker\exam-tracker-main"
npm run dev
```

### Build for Production

```bash
npm run build
```

### Check for Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console
4. Perform test action
5. Look for red errors

## 📱 Mobile Testing

1. Deploy to Vercel
2. Open on mobile device
3. Test signup flow
4. Test Google OAuth on mobile
5. Verify responsive design works

## ✅ Final Checklist

Before marking as complete:

- [ ] New email signup creates Firestore document
- [ ] Google signup creates Firestore document
- [ ] Existing users can log in without issues
- [ ] Dashboard loads without errors
- [ ] No undefined/null crashes
- [ ] All features functional (add subject, toggle modules, etc.)
- [ ] Works in incognito mode
- [ ] Works on mobile
- [ ] No console errors
- [ ] Firestore rules enforced correctly

## 🎯 Expected Results

### New User Journey:

1. Sign up → ✅ Account created
2. Verify email → ✅ Email confirmed
3. Login → ✅ Redirects to onboarding
4. Complete onboarding → ✅ Firestore document saved
5. View dashboard → ✅ Loads with default values
6. Add data → ✅ Updates persist
7. Logout & login → ✅ Data restored

### All Steps Should Complete Without Errors!

---

**Testing Time Estimate**: 15-20 minutes for full flow
**Critical Path**: New signup → Onboarding → Dashboard
**Priority**: Test new user signup first
