# Professional Exam Syllabus Tracker

A web application to help CA, CS, and CMA students in India track their syllabus progress, stay organized, and remain focused on their exam goals.

## Features

- 🔐 **User Authentication** - Email/password and Google sign-in
- 📚 **Multi-Course Support** - CS, CA, and CMA courses with all levels
- 📊 **Progress Tracking** - Track completion for each chapter across all papers
- ➕ **Custom Subjects** - Add your own subjects with custom modules
- ⏰ **Exam Countdown** - Real-time countdown to your target exam date
- 🔥 **Honesty-Based Study Streak** - Daily self-check system to track study habits
- 🏆 **Achievements** - Unlock milestones as you progress
- ⚙️ **Customizable Settings** - Change target exam and groups anytime
- 💾 **Real-time Sync** - All data synced with Firebase Firestore
- 🎨 **Improved Readability** - Dark text on white background for better contrast

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Firebase (Authentication + Firestore)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Setup Instructions

### 1. Install Dependencies

```bash
cd exam-tracker
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google sign-in
4. Create a **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Set up rules (see below)
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" and add a web app
   - Copy the configuration

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Fill in your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules

In Firebase Console > Firestore Database > Rules, set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy!

## Project Structure

```
exam-tracker/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Main page with routing logic
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Auth/             # Authentication components
│   ├── Dashboard/        # Dashboard components
│   └── Onboarding/       # Onboarding wizard
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── data/                 # Static data
│   └── syllabus.ts       # Course syllabus data
├── lib/                  # Utility libraries
│   └── firebase.ts       # Firebase configuration
└── types/                # TypeScript types
    └── index.ts          # Type definitions
```

## Usage

1. **Sign Up/Login** - Create an account or sign in with Google
2. **Complete Onboarding** - Select your course, level, target exam, and groups
3. **Track Progress** - Mark chapters as complete by checking them off
4. **Add Custom Subjects** - Click "Add Custom Subject" to create your own subjects with modules
5. **Daily Study Check** - Answer honestly when the popup asks if you studied today
6. **Monitor Metrics** - View countdown, overall progress, and study streak (click streak card to manually check in)
7. **Earn Achievements** - Unlock milestones as you progress
8. **Update Settings** - Change your target exam or groups anytime
9. **Delete Subjects** - Remove custom subjects using the delete button on each card

## Key Features Explained

### Custom Subjects System

- Add unlimited custom subjects with any number of modules
- Each subject automatically calculates its own progress percentage
- Overall progress includes both predefined papers and custom subjects
- Delete subjects when no longer needed

### Honesty-Based Study Streak

- Daily popup asks "Did you study today?"
- Answering "Yes" increments your streak if checked yesterday or starts at 1
- Answering "No" resets your streak to 0
- Can manually trigger by clicking the Study Streak card
- Based on daily check-ins, not chapter completion

### Progress Calculation

**Overall Progress** = (Completed Items / Total Items) × 100

Where:
- Total Items = All chapters from course papers + All modules from custom subjects
- Completed Items = Checked chapters + Checked custom modules

## Customization

### Adding More Courses or Papers

Edit `data/syllabus.ts` to add or modify course content.

### Changing Milestones

Edit `components/Dashboard/MilestonesSection.tsx` to customize achievements.

### Adjusting Text Colors

All text colors are set to ensure high readability. Modify `app/globals.css` to change the color scheme.

## Support

For issues or questions, please create an issue in the repository.

## License

MIT License - feel free to use this for your own projects!
