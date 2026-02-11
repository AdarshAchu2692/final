import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS class merger
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Fetch all communities
export async function fetchCommunities() {
  try {
    console.log('📡 Fetching from:', `${API_URL}/communities`);
    const response = await fetch(`${API_URL}/communities`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Received:', data);
    return data;
  } catch (error) {
    console.error('❌ fetchCommunities error:', error);
    throw error;
  }
}

// Fetch single community by ID
export async function fetchCommunityById(id) {
  try {
    const response = await fetch(`${API_URL}/communities/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`❌ fetchCommunityById ${id} error:`, error);
    throw error;
  }
}

// You can add more API functions here as needed