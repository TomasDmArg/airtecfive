import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = 'https://weeexdnncssrmildyhqr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlZWV4ZG5uY3Nzcm1pbGR5aHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NDE1MTQsImV4cCI6MjAxNDQxNzUxNH0.LNLZykpBjYQlLK_1LJlVGfGVmv2iHt_mQdaaibBeCWs'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)