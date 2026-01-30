export const getEnvVariables = () => {
  return {
    VITE_API_URL:
      import.meta.env.VITE_API_URL ||
      'https://restaurante-backend-api.onrender.com/api',
    VITE_WS_URL:
      import.meta.env.VITE_WS_URL ||
      'wss://restaurante-backend-api.onrender.com',
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'Sistema Restaurante',
    VITE_SUPABASE_URL:
      import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
    VITE_SUPABASE_ANON_KEY:
      import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'
  };
};
