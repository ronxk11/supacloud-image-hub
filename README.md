## Supabase Storage Demo (React + Vite)
A simple project demonstrating how to upload images/videos using Supabase Storage with a React + Vite frontend.

## Tech Stack
React
Vite
TypeScript
Tailwind CSS
Supabase

1️⃣ Clone the repository
git clone REPO_URL
cd PROJECT_NAME

2️⃣ Install dependencies
npm install

3️⃣ Create .env file
Create a file called .env in the root of the project:
touch .env

## Add this inside:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id

👉 Get these values from your Supabase dashboard:
Settings → API

4️⃣ Run the project
npm run dev

## 🔐 Important
.env is ignored from Git for security.
Make sure Row Level Security (RLS) is enabled in Supabase.
Use storage policies to protect uploads.

⭐ Features
    Upload images/videos to Supabase Storage
    Public file URLs
    Frontend-only integration
    Minimal UI

🙌 Author
Built by RONAK
Feel free to fork, star ⭐, and contribute.
