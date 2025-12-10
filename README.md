# Showcase Learn & Launch

A comprehensive online learning platform and instructor dashboard built with modern web technologies. Create, manage, and publish courses with an intuitive Udemy-inspired interface.

## 🎯 Project Overview

Showcase Learn & Launch is a full-featured e-learning platform that includes:
- **Student Portal**: Browse and enroll in courses, read blog posts, view instructor portfolio
- **Instructor Dashboard**: Create and manage courses with an advanced curriculum builder
- **Admin Panel**: Manage published courses, track student data, monitor purchases
- **Database Integration**: Supabase PostgreSQL backend for persistent course storage

## ✨ Completed Features

### 1. **User Authentication** ✅
- Login and signup pages with form validation
- Protected routes for authenticated users
- Auth context for global state management
- Session persistence

### 2. **Student Portal** ✅
- **Homepage**: Hero section, featured courses showcase, learning benefits, call-to-action
- **Courses Page**: Browse all available courses with filtering and search
- **Course Details**: Detailed course pages with curriculum overview, instructor info, pricing
- **Blog Section**: Blog posts listing with individual post pages
- **Portfolio**: Project showcase with project cards and descriptions
- **About Page**: Instructor bio and platform information

### 3. **Course Upload Dashboard** ✅ (Instructor Feature)
A professional, Udemy-inspired multi-step course creation interface:

#### **Step 1: Basics**
- Course title, subtitle, and description
- Category and level selection
- Course thumbnail upload with preview
- Learning objectives and course requirements (UI ready)

#### **Step 2: Curriculum Builder** ✅
- **Udemy-Style Structure**: Organize content into sections with nested lectures
- **Video Upload & Processing**: Upload videos with automatic duration extraction
- **Lecture Management**: 
  - Add, edit, duplicate, and delete lectures
  - Set lecture titles and types (video, article, quiz)
  - Resource file uploads per lecture
  - Drag-and-drop reordering of sections and lectures
- **Video Preview Modal**: Play videos inline with playback controls
- **Curriculum Metrics**: Real-time display of total course duration and lesson count
- **State Persistence**: Curriculum data persists across tab navigation using React Context

#### **Step 3: Pricing & Promo**
- Price input with currency formatting
- Promo video upload UI
- Price updates reflected in preview panel in real-time

#### **Step 4: Publish**
- Review course details before publishing
- One-click publish to database
- Course data saved to Supabase (title, description, category, level, price, duration, lesson count, thumbnail)

### 4. **Admin Dashboard** ✅
- **Admin Layout**: Sidebar navigation with protected access
- **Admin Courses Page**: 
  - List all published courses
  - View course metrics (price, lessons, duration)
  - Edit courses (navigate to upload dashboard)
  - Delete courses with confirmation
  - No demo/placeholder data (shows only published courses)
- **Admin Course Posts**: Placeholder ready for blog management
- **Admin Users**: Placeholder ready for user management
- **Admin Purchases**: Placeholder ready for purchase analytics

### 5. **Data Persistence** ✅
- **Supabase Integration**: 
  - PostgreSQL database with `courses` table
  - Insert operations on publish
  - Course data includes all metadata (thumbnail URL, lesson count, price, etc.)
- **React Context API**:
  - `CourseContext`: Global state for published courses
  - `CurriculumContext`: Global state for curriculum sections/lectures
  - localStorage persistence for CourseContext
- **Local State Management**: Form state tracked across multi-step navigation

### 6. **UI/UX Enhancements** ✅
- **Responsive Design**: Mobile-first layout, optimized for all screen sizes
- **Tailwind CSS Styling**: Modern, clean design with theme tokens
- **Radix UI Components**: Professional accordion, dialogs, buttons, badges
- **Lucide Icons**: Consistent iconography throughout app
- **Dynamic Preview Panel**: Real-time preview of course details as you build
- **Toast Notifications**: User feedback for actions (add section, publish, etc.)
- **Drag-and-Drop**: Visual reordering of curriculum sections and lectures
- **Video Duration Extraction**: Automatic parsing of video metadata

## 🛠 Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: lucide-react
- **Routing**: react-router-dom
- **State Management**: React Context API + localStorage
- **Backend**: Supabase (PostgreSQL)
- **Development**: Node.js + npm

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
# Clone the repository
git clone https://github.com/IsGameliel/showcase-learn-launch.git

# Navigate to project directory
cd showcase-learn-launch

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:8086` with hot module reloading.

## 📁 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── admin/           # Admin-specific components
│   │   ├── AdminLayout.tsx
│   │   ├── CurriculumBuilder.tsx
│   │   └── PricingPublish.tsx
│   ├── auth/            # Authentication components
│   ├── blog/            # Blog-related components
│   ├── courses/         # Course card components
│   ├── home/            # Homepage sections
│   ├── layout/          # Layout components (Navbar, Footer)
│   ├── portfolio/       # Portfolio components
│   └── ui/              # Radix UI component library
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminCourses.tsx
│   │   ├── CourseUploadDashboard.tsx
│   │   └── ...other admin pages
│   ├── About.tsx
│   ├── Blog.tsx
│   ├── Courses.tsx
│   └── ...other pages
├── contexts/            # React Context providers
│   ├── AuthContext.tsx
│   ├── CourseContext.tsx
│   └── CurriculumContext.tsx
├── data/                # Static data (blogs, courses, projects)
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations (Supabase)
├── lib/                 # Utility functions
├── App.tsx              # Root component with routing
└── main.tsx             # Application entry point
```

## 🔐 Protected Routes

The following routes require authentication:
- `/admin/*` - All admin pages
- Course creation and editing features are instructor-only

## 📊 Database Schema

### Courses Table
```sql
- id (UUID)
- title (Text)
- description (Text)
- category (Text)
- level (Text: Beginner/Intermediate/Advanced)
- price (Decimal)
- duration (Text: MM:SS format)
- lessons_count (Integer)
- thumbnail_url (Text)
- is_published (Boolean)
- created_at (Timestamp)
```

## 🎓 Usage Guide

### Creating a Course (Instructor)

1. Navigate to Admin Dashboard → Create Course
2. **Basics Tab**: Fill in course title, subtitle, category, level, and upload thumbnail
3. **Curriculum Tab**: 
   - Create sections (e.g., "Introduction", "Advanced Topics")
   - Add lectures to each section
   - Upload videos (duration auto-extracted)
   - Add resources and reorder with drag-and-drop
4. **Pricing Tab**: Set course price
5. **Publish Tab**: Review details and click "Publish Course"
6. Course appears in Admin Courses list and becomes available to students

### Browsing Courses (Student)

1. Visit `/courses` to see all published courses
2. Click a course card to view details
3. Enroll or view curriculum details

## 🚧 Future Enhancements

- [ ] Lesson detail pages with video playback
- [ ] Student enrollment and purchase system
- [ ] Video file uploads to cloud storage (Supabase Storage)
- [ ] Course ratings and reviews
- [ ] Student progress tracking
- [ ] Certificate generation
- [ ] Live streaming support
- [ ] Q&A forum per course
- [ ] Payment integration (Stripe)

## 📝 Development Notes

- All component state persists across navigation using React Context
- Curriculum changes are immediately reflected in the preview panel
- Course data auto-saves to localStorage for CourseContext
- Supabase operations include error handling and toast notifications
- Responsive design tested on mobile, tablet, and desktop viewports

## 📄 License

This project is open source. Feel free to fork and customize for your needs.

## 🌐 Deployment

### Deploy to Vercel

Vercel is the easiest way to deploy your React app. Follow these steps:

1. **Push your code to GitHub** (already done)

2. **Import your repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Select your `showcase-learn-launch` repository
   - Click "Import"

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Deploy**:
   - Vercel automatically deploys when you push to `main` branch
   - Your app will be live at `https://your-project.vercel.app`

5. **Custom Domain** (Optional):
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Other Deployment Options

- **Netlify**: Similar process to Vercel, connect your GitHub repo
- **AWS Amplify**: AWS-based deployment with custom domain support
- **GitHub Pages**: For static builds (limited for dynamic apps)

## 🛠 Development & Contributing

### Local Development

This project uses Vite for fast development with HMR (Hot Module Replacement). Make changes to files and see them instantly.

### Building for Production

```sh
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The built files will be in the `dist/` folder, ready to deploy anywhere.

### Code Quality

- TypeScript for type safety
- ESLint for code consistency
- Tailwind CSS for utility-first styling
- Component-based architecture for reusability
