// src/main/config/api-config.ts
import dotenv from 'dotenv';

dotenv.config();

export const apiConfig = {
  baseUrl: process.env.API_BASE_URL || 'https://api.central.example.com',
  apiKey: process.env.API_KEY || '',
};