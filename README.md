# Task Management Application

A modern, production-ready task management application built with Next.js 16, Supabase, and TypeScript. Designed for recruitment challenge with professional architecture, comprehensive API layer, and responsive design across all devices.

## 🎯 Features

### Core Functionality
- **Secure Authentication**: Email/password signup and login with persistent JWT sessions
- **Complete CRUD Operations**: Create, read, update, and delete tasks
- **Task Properties**:
  - Description (required)
  - Due Date (optional)
  - Priority Levels: High (1), Medium (2), Low (3)
  - Notes (optional)
  - Completion Status

### Advanced Features
- **Search & Filter**: Full-text search by description, filter by status (All/Active/Completed)
- **Multi-Sort Options**: Sort by creation date, due date, or priority
- **Smart Notifications**: Real-time alerts for tasks due today with persistent notifications
- **Overdue Protection**: 3-layer defense system prevents modification of overdue tasks
- **Real-time Display**: Current date and time in navbar (updates every second)
- **Professional UI**: Custom CSS with no frameworks, fully responsive design
- **Icon Indicators**: Visual cues for task status (lock for overdue, warning for today)

### Security Features
- Row-Level Security (RLS) policies on database
- JWT-based authentication flow
- User isolation enforced at database level
- API route layer for server-side validation
- No API keys exposed in client code

## 🏗️ Architecture

### System Architecture

```
┌──────────────────────────────────────────┐
│      Next.js Frontend (Browser)          │
│                                          │
│  - Authentication UI (page.tsx)         │
│  - Task Dashboard (tasks/page.tsx)      │
│  - Components (TaskItem.tsx)             │
│  - Client API Wrapper (lib/apiClient.ts)│
│                                          │
└────────────────┬─────────────────────────┘
                 │
                 │ HTTP/HTTPS
                 │ (JWT Token in Authorization header)
                 ↓
┌──────────────────────────────────────────┐
│   Next.js API Routes (Backend Layer)     │
│                                          │
│  /api/auth/login      - User login      │
│  /api/auth/signup     - User signup     │
│  /api/auth/logout     - User logout     │
│  /api/tasks           - List & Create   │
│  /api/tasks/[id]      - Update & Delete │
│                                          │
│  - Input validation                      │
│  - JWT verification                      │
│  - Error handling                        │
│                                          │
└────────────────┬─────────────────────────┘
                 │
                 │ Server-to-Server (Secure)
                 │ (Uses Supabase Anon Key with JWT context)
                 ↓
┌──────────────────────────────────────────┐
│  Supabase Backend (PostgreSQL)           │
│                                          │
│  - Authentication                        │
│  - Database (users, tasks)              │
│  - Row-Level Security Policies          │
│  - Real-time Sync (optional)            │
│                                          │
└──────────────────────────────────────────┘
```

### Data Flow: Creating a Task

```
1. User fills form in UI
   └─ Description, Due Date, Priority, Notes

2. Form submission → POST /api/tasks
   └─ Request body: {description, dueDate, priority, notes}
   └─ Header: Authorization: Bearer [JWT_TOKEN]

3. API Route processes request
   ├─ Extract JWT token from header
   ├─ Validate input (description required, etc)
   ├─ Create Supabase client with JWT in header context
   └─ RLS will extract user_id from JWT

4. Database insertion
   ├─ RLS Policy checks: auth.uid() = user_id
   ├─ Auto-inserts user_id from JWT token
   └─ Returns new task

5. API returns response
   ├─ Status: 201 (Created)
   └─ Body: {success: true, task: {...}}

6. Frontend updates UI
   └─ Adds new task to list
   └─ Shows success toast notification
   └─ Clears form fields
```

### Authentication Flow

```
1. User enters email & password
   │
2. POST /api/auth/login
   ├─ Validate email/password format
   ├─ Call supabase.auth.signInWithPassword()
   └─ Receive JWT token & user ID
   │
3. API returns {token, userId, email}
   │
4. Client stores in localStorage
   {
     token: "eyJhbGc...",
     userId: "550e8400-...",
     email: "user@example.com"
   }
   │
5. Subsequent requests include JWT
   Header: Authorization: Bearer [token]
   │
6. JWT decoded server-side
   ├─ User ID extracted (auth.uid())
   ├─ Supabase client created with JWT context
   ├─ RLS policies automatically enforced
   └─ User only sees own data
```

## 📡 API Reference

### Authentication Endpoints

#### POST `/api/auth/login`
User login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "session": {
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Error (401):**
```json
{
  "error": "Email atau password salah"
}
```

---

#### POST `/api/auth/signup`
Create new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Akun berhasil dibuat",
  "session": {
    "email": "newuser@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Validation Errors (400):**
```json
{
  "error": "Password minimal 6 karakter"
}
```

---

#### POST `/api/auth/logout`
Clear user session.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

### Tasks Endpoints

#### GET `/api/tasks`
Retrieve all tasks for authenticated user (RLS-filtered).

**Headers:**
```
Authorization: Bearer [JWT_TOKEN]
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "tasks": [
    {
      "id": "task-123",
      "user_id": "user-456",
      "description": "Learn TypeScript",
      "due_date": "2026-05-25",
      "priority": 1,
      "notes": "Focus on Advanced Types and Generics",
      "completed": false,
      "created_at": "2026-05-21T10:30:00Z"
    }
  ]
}
```

**Error (401):**
```json
{
  "error": "User tidak authenticated"
}
```

---

#### POST `/api/tasks`
Create new task for authenticated user.

**Headers:**
```
Authorization: Bearer [JWT_TOKEN]
Content-Type: application/json
```

**Request:**
```json
{
  "description": "Complete project documentation",
  "dueDate": "2026-05-25",
  "priority": 1,
  "notes": "Include API documentation and examples"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task berhasil dibuat",
  "task": {
    "id": "task-124",
    "user_id": "user-456",
    "description": "Complete project documentation",
    "due_date": "2026-05-25",
    "priority": 1,
    "notes": "Include API documentation and examples",
    "completed": false,
    "created_at": "2026-05-21T11:00:00Z"
  }
}
```

**Validation Error (400):**
```json
{
  "error": "Description tidak boleh kosong"
}
```

---

#### PATCH `/api/tasks/[id]`
Update task (toggle completion status).

**Headers:**
```
Authorization: Bearer [JWT_TOKEN]
Content-Type: application/json
```

**Request:**
```json
{
  "completed": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task berhasil diupdate",
  "task": {
    "id": "task-123",
    "user_id": "user-456",
    "description": "Learn TypeScript",
    "due_date": "2026-05-25",
    "priority": 1,
    "notes": "Focus on Advanced Types",
    "completed": true,
    "created_at": "2026-05-21T10:30:00Z"
  }
}
```

**RLS Error (404):**
```json
{
  "error": "Task tidak ditemukan atau tidak punya akses"
}
```

---

#### DELETE `/api/tasks/[id]`
Delete task permanently.

**Headers:**
```
Authorization: Bearer [JWT_TOKEN]
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task berhasil dihapus"
}
```

**RLS Error (404):**
```json
{
  "error": "Task tidak ditemukan atau tidak punya akses"
}
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.2.6 (App Router)
- **Backend**: Next.js API Routes (server-side)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT tokens)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Styling**: Custom CSS (no frameworks)
- **Language**: TypeScript 5.0+
- **Package Manager**: npm

## 📋 Project Structure

```
my-task-management/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts          # POST /api/auth/login
│   │   │   ├── signup/
│   │   │   │   └── route.ts          # POST /api/auth/signup
│   │   │   └── logout/
│   │   │       └── route.ts          # POST /api/auth/logout
│   │   └── tasks/
│   │       ├── route.ts              # GET, POST /api/tasks
│   │       └── [id]/
│   │           └── route.ts          # PATCH, DELETE /api/tasks/[id]
│   ├── page.tsx                      # Authentication page (login/signup)
│   ├── tasks/
│   │   ├── page.tsx                  # Task dashboard
│   │   └── tasks.css                 # Dashboard styles
│   ├── layout.tsx                    # Root layout with providers
│   ├── auth.css                      # Authentication styles
│   └── globals.css                   # Global styles
├── components/
│   └── TaskItem.tsx                  # Reusable task item component
├── lib/
│   ├── auth.ts                       # Auth utilities (uses API routes)
│   ├── supabaseClient.ts             # Supabase client setup
│   ├── apiClient.ts                  # API client wrapper with JWT
│   ├── constants.ts                  # App constants & configuration
│   ├── dateUtils.ts                  # Date formatting utilities
│   └── taskUtils.ts                  # Task filtering/sorting utilities
├── supabase/
│   └── schema.sql                    # Database schema & RLS policies
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── eslint.config.mjs                 # ESLint configuration
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher
- Supabase account (free tier available at https://supabase.com)

### Installation Steps

**1. Clone and install dependencies**
```bash
git clone <your-github-repo-url>
cd my-task-management
npm install
```

**2. Create Supabase project**
- Visit https://supabase.com and create a new project
- Wait for project initialization (2-5 minutes)

**3. Setup database**
- In Supabase dashboard, go to SQL Editor
- Create a new query and paste contents of `supabase/schema.sql`
- Execute the query
- This creates `users` and `tasks` tables with RLS policies

**4. Get credentials**
- Go to Project Settings → API
- Copy `Project URL` and `anon public key`

**5. Configure environment**
Create `.env.local` in project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**6. Start development server**
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📖 Usage Guide

### First Time Users

1. **Create Account**
   - Click "Sign Up" on login page
   - Enter email and password (6+ characters)
   - Click "Create Account"

2. **Navigate to Dashboard**
   - Automatically redirected to `/tasks`
   - See empty task list

3. **Create First Task**
   - Fill in task form on the right
   - Enter description (required)
   - Optional: add due date, priority, notes
   - Click "Create Task"

### Task Management

**Complete Task:**
- Click checkbox next to task
- Task moves to completed state
- Cannot complete if overdue (lock icon shown)

**Mark Incomplete:**
- Click checkmark on completed task
- Returns to active state

**Delete Task:**
- Click trash icon on any task
- Task removed permanently
- Works on overdue and completed tasks

**Search Tasks:**
- Type in search box
- Matches task descriptions (case-insensitive)
- Filters in real-time

**Filter by Status:**
- Use dropdown to select: All / Active / Completed
- Only shows tasks matching filter

**Sort Tasks:**
- Click sort buttons to organize by:
  - **Created**: Newest first (default)
  - **Due Date**: Earliest deadline first
  - **Priority**: High → Medium → Low

### Visual Indicators

| Icon | Meaning |
|------|---------|
| 🔒 | Task is overdue (cannot mark complete) |
| ⚠️ | Task due today (urgent) |
| ✓ | Task is completed |
| ⭕ | Task is incomplete |

## 🎨 Design System

### Color Palette
```
Primary Dark:     #2D5E41 (Main accent, buttons)
Primary Light:    #43B87A (Hover states)
Success:          #2e7d32 (Low priority, checkmarks)
Warning:          #ffa500 (Deadline alerts)
Error:            #ff6b6b (Overdue, high priority)
Background:       #f5f5f5 (Light gray)
Border:           #ddd (Light borders)
Text:             #333 (Dark text)
```

### Responsive Breakpoints
- **Desktop**: >1024px (2-column layout, sticky form)
- **Tablet**: 768px-1024px (1-column, form below tasks)
- **Mobile**: 640px-768px (Optimized touch targets)
- **Small Mobile**: <640px (Minimal spacing, compact UI)

### Typography
- **Headings**: System fonts, 1.5-2.5rem
- **Body**: System fonts, 0.875-1rem
- **Monospace**: `ui-monospace`, for code blocks

## 🔐 Security Architecture

### Security Layers

**Layer 1: Frontend Validation**
- Required fields checked before submission
- Email format validation
- Password strength requirements

**Layer 2: API Route Validation**
- Input sanitization
- Request body validation
- JWT token extraction from Authorization header

**Layer 3: Database RLS Policies**
```sql
-- Users can only access their own tasks
CREATE POLICY "auth_access"
  ON tasks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Layer 4: JWT Authentication**
- Access token sent in Authorization header
- Server extracts JWT from Authorization header
- Supabase client created with JWT context
- RLS policies use `auth.uid()` from JWT claims
- User ID automatically filtered by database

### User Data Isolation
- Users managed by Supabase Auth
- Tasks stored with user_id reference
- RLS policies prevent cross-user access
- Each API route validates JWT authenticity
- Supabase handles JWT signature verification

## 💻 Development Guide

### Code Organization Principles

**1. Constants Centralization** (`lib/constants.ts`)
```typescript
// ✅ GOOD: Use constants
color: COLORS.PRIMARY_DARK

// ❌ BAD: Hardcoded values
color: "#2D5E41"
```

**2. Utility Extraction** (`lib/dateUtils.ts`, `lib/taskUtils.ts`)
```typescript
// ✅ GOOD: Reusable functions
const today = getTodayDateString();
const filtered = filterAndSortTasks(tasks, query, status, sort);

// ❌ BAD: Inline logic scattered everywhere
const today = new Date().toISOString().split('T')[0];
```

**3. Component Composition** (`components/TaskItem.tsx`)
```typescript
// ✅ GOOD: Props-based components
<TaskItem task={task} onToggle={toggle} onDelete={delete} />

// ❌ BAD: Component with side effects
<Task taskId={id} />
```

**4. Type Safety** (Throughout)
```typescript
// ✅ GOOD: Typed functions
function filterTasks(tasks: Task[], query: string): Task[] {
  // ...
}

// ❌ BAD: Any types
function filterTasks(tasks: any[], query: any): any {
  // ...
}
```

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `TaskItem.tsx`, `Button.tsx` |
| Functions | camelCase | `getTodayDateString()`, `filterTasks()` |
| Constants | UPPER_SNAKE_CASE | `PRIMARY_COLOR`, `MAX_RETRIES` |
| CSS Classes | kebab-case | `.task-checkbox`, `.task-item` |
| Files | kebab-case | `task-item.tsx`, `date-utils.ts` |
| APIs | lowercase | `/api/tasks`, `/api/auth/login` |

### Adding New Features Checklist

- [ ] Check if constant/utility already exists
- [ ] Add to `lib/constants.ts` if needed
- [ ] Create utility function in `lib/` if needed
- [ ] Build as reusable component in `components/`
- [ ] Add TypeScript types/interfaces
- [ ] Add JWT verification in API route (if needed)
- [ ] Test on mobile, tablet, desktop
- [ ] Update this README if user-facing change

## 🧪 Testing Scenarios

### Authentication Flow
- [ ] Signup with new email works
- [ ] Signup with short password shows error
- [ ] Login with correct credentials works
- [ ] Login with wrong password fails
- [ ] Session persists after page refresh
- [ ] Logout clears session

### Task Operations
- [ ] Create task with description only
- [ ] Create task with all fields
- [ ] Search finds tasks by partial match
- [ ] Filter All/Active/Completed works
- [ ] Sort by Created/Due Date/Priority works
- [ ] Complete task marks as done
- [ ] Cannot complete overdue task
- [ ] Delete task removes it permanently

### API Verification
- [ ] API routes return proper status codes
- [ ] JWT token sent in Authorization header
- [ ] RLS policies enforced (users see only own tasks)
- [ ] Error messages are clear and helpful
- [ ] API validation prevents invalid data

### UI/UX Verification
- [ ] Layout responsive on all breakpoints
- [ ] Icons display correctly
- [ ] Toast notifications appear/disappear
- [ ] Real-time clock updates every second
- [ ] Forms clear after submission
- [ ] Error messages are clear and helpful

## 📦 Building & Deployment

### Local Build
```bash
npm run build
```

Builds production-optimized bundle in `.next/` directory.

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy application"
   git push origin main
   ```

2. **Connect Vercel**
   - Visit https://vercel.com/new
   - Import your GitHub repository
   - Select Next.js as framework

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Redeploy

4. **Verify Deployment**
   - Visit provided Vercel domain
   - Test all functionality
   - Check browser console for errors

## ❓ Troubleshooting

### Build Fails with TypeScript Errors
```bash
npm run build -- --no-cache
npm run dev
```

### Tasks Not Loading / RLS Error on Create
- Verify JWT token is valid and sent in Authorization header
- Check Supabase RLS policies are created correctly
- Verify user_id in JWT matches user in database
- Check browser console for API error responses

### Login Loop (Stuck on Auth Page)
1. Clear localStorage: Open DevTools → Application → Storage → Clear All
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Check if JWT token is present in response

### Styling Broken on Mobile
1. Check viewport meta tag exists in `layout.tsx`
2. Test in Chrome DevTools Device Emulation
3. Verify media queries in CSS files
4. Check for hardcoded pixel widths

## 📊 Performance Notes

- **API Routes**: Server-side routing prevents client-side bloat
- **Code Splitting**: Next.js automatically splits code per route
- **Database Queries**: RLS policies reduce unnecessary data transfer
- **Token Management**: JWT stored locally, reduces server authentication calls
- **Responsive CSS**: No utility framework overhead

## 🎓 Learning Outcomes

This project demonstrates:

1. **Full-Stack Development**: Frontend + Backend (API Routes) + Database
2. **JWT Authentication**: Secure token-based authentication
3. **API Design**: RESTful API routes with proper error handling
4. **Database Security**: Row-Level Security policies at database layer
5. **Responsive Design**: Mobile-first CSS approach
6. **Type Safety**: TypeScript throughout entire stack
7. **Code Organization**: Modular, maintainable architecture
8. **Production Deployment**: Vercel integration and deployment

## ✅ Security Checklist

- ✅ No API keys exposed in client code
- ✅ JWT tokens sent only in Authorization header
- ✅ All API routes validate user authenticity
- ✅ RLS policies prevent cross-user data access
- ✅ Input validation on both client and server
- ✅ Environment variables for sensitive data
- ✅ HTTPS ready for production
- ✅ Proper error handling without exposing details

## 📄 License

MIT License - Free to use, modify, and distribute for learning and projects.

---

**Last Updated**: May 21, 2026  
**Version**: 1.0.0  
**Status**: Production Ready  
**Backend Architecture**: Next.js API Routes with Supabase  
**Data Flow**: Frontend → API Routes → Supabase → RLS Policies → Frontend
