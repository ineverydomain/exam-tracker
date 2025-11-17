# Changelog

## Version 2.0 - Enhanced User Experience Update

### 🎨 UI & Accessibility Improvements

#### Fixed Font Colors & Readability
- **Issue**: Text was too light and blended with white background
- **Solution**: 
  - Changed all text colors to dark gray (#1e1e1e) or black for better contrast
  - Updated all headings, paragraphs, and buttons across the app
  - Maintained white background for clean, professional look
  - Applied changes to:
    - Dashboard header
    - All card components (Countdown, Progress, Study Streak)
    - Paper and Custom Subject cards
    - Modal dialogs
    - Settings panel

### 📚 Dynamic Subject & Module System

#### Custom Subjects Feature
- **New Capability**: Users can now add their own subjects beyond the predefined course papers
- **How it Works**:
  - Click "Add Custom Subject" button on dashboard
  - Enter subject name (e.g., "Data Structures", "Machine Learning")
  - Specify number of modules (1-100)
  - Modules are auto-numbered (Module 1, Module 2, etc.)
  - Each subject displays:
    - Subject name with "Custom" badge
    - Individual progress bar
    - Completion percentage
    - Expandable module list with checkboxes
    - Delete button to remove subject

#### Progress Calculation
- **Smart Calculation**: Overall progress now includes both predefined papers AND custom subjects
- **Formula**: `(Completed Chapters + Completed Modules) / (Total Chapters + Total Modules) × 100`
- **Real-time Updates**: Progress updates instantly when checking/unchecking any item
- **Per-Subject Progress**: Each custom subject shows its own completion percentage

#### Data Persistence
- All custom subjects stored in Firebase Firestore
- Survives page reloads and logout/login
- Syncs across devices in real-time

### 🔥 Honesty-Based Study Streak

#### New Streak System
- **Old System**: Automatically tracked based on chapter completion
- **New System**: Daily self-check popup with honesty prompt

#### How It Works
1. **Daily Popup**: Appears once per day when you haven't checked in yet
2. **Question**: "Did you study today? Be honest with yourself."
3. **Two Options**:
   - ✅ **Yes, I Did!** - Increments streak by 1 (or starts at 1)
   - ❌ **No** - Resets streak to 0

#### Streak Logic
- If you check in today and also checked yesterday: streak += 1
- If you check in today but missed previous days: streak = 1
- If you answer "No": streak = 0
- Manual trigger: Click the Study Streak card anytime

#### Benefits
- Encourages honest self-reflection
- Builds genuine study habits
- Not tied to specific chapter completion
- Flexible for different study methods

### 🗄️ Data Structure Updates

#### Updated UserData Interface
```typescript
{
  customSubjects: CustomSubject[];  // NEW: Array of user-defined subjects
  studyStreak: {
    current: number;
    lastCheckedDate: string;  // Changed from lastMarkedDate
  }
}
```

#### New Types Added
```typescript
interface CustomSubject {
  id: string;
  name: string;
  modules: Module[];
  createdAt: string;
}

interface Module {
  id: string;
  name: string;
  completed: boolean;
}
```

### 🎯 User Experience Enhancements

#### Visual Improvements
- Better color contrast throughout the app
- Darker, more readable text on all surfaces
- Consistent styling across all components
- Hover effects on clickable elements

#### Interaction Improvements
- Click Study Streak card to manually trigger check-in
- Visual feedback on all interactive elements
- Confirmation dialogs for destructive actions
- Clear success/error messages

#### Mobile Responsiveness
- All new features work on mobile devices
- Touch-friendly buttons and interactions
- Responsive layout for custom subjects section

### 🔄 Migration Support

#### Automatic Data Migration
- Existing users automatically get `customSubjects: []` field
- Old `lastMarkedDate` gracefully handles as `lastCheckedDate`
- No manual migration required
- All existing progress preserved

### 📊 Updated Dashboard Layout

#### New Sections
1. **Modals & Popups** - Study check, add subject, settings
2. **Key Metrics** - Countdown, progress (with custom subjects), clickable streak
3. **Milestones** - Achievement badges
4. **Custom Subjects** - New dedicated section (when subjects exist)
5. **Course Papers** - Renamed when custom subjects present
6. **Add Subject Button** - Multiple placement for easy access

### 🎨 Component Architecture

#### New Components Created
- `AddSubjectModal.tsx` - Modal for adding custom subjects
- `CustomSubjectCard.tsx` - Display card for custom subjects with modules
- `StudyCheckPopup.tsx` - Daily honesty-based study check dialog

#### Updated Components
- `Dashboard.tsx` - Complete rewrite with all new features
- `StudyStreakCard.tsx` - Now clickable with visual feedback
- `ProgressCard.tsx` - Updated text colors
- `CountdownCard.tsx` - Updated text colors
- `PaperCard.tsx` - Updated text colors

### 🚀 Performance Considerations

- Real-time Firestore listeners for instant updates
- Efficient progress calculations
- Minimal re-renders with proper React optimization
- Fast modal animations with Tailwind

### 📖 Documentation Updates

- Updated README.md with all new features
- Added detailed feature explanations
- Updated usage instructions
- Added customization guide
- Created this CHANGELOG.md

---

## Migration Notes for Developers

If you're updating from version 1.0:

1. **Firebase Data**: The app will automatically add `customSubjects: []` to existing user documents
2. **Types**: Import new types: `CustomSubject`, `Module`
3. **Progress Calculation**: Use the new `calculateOverallProgress()` function that includes custom subjects
4. **Streak Logic**: Update any code referencing `lastMarkedDate` to `lastCheckedDate`

---

## Future Enhancements (Potential)

- Edit module names after creation
- Reorder modules within subjects
- Subject categories/tags
- Export progress reports
- Study time tracking
- Collaborative study groups
- Mobile app version

---

**Version**: 2.0  
**Release Date**: 2025-10-17  
**Breaking Changes**: None (backward compatible)
