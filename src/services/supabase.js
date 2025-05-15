import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://dkmyjicnuldrrkvvwcjr.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbXlqaWNudWxkcnJrdnZ3Y2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NDg2MjIsImV4cCI6MjA2MTAyNDYyMn0.f-T-GbnWaO7BTPBqOUQuKEO_R99lHgHPSEn6ORYKly4"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;