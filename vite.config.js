import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const contactEmail = [
        env.VITE_CONTACT_EMAIL,
        env.VITE_CONTACT_RECEIVER_EMAIL,
        env.VITE_PUBLIC_CONTACT_EMAIL,
        env.VITE_EMAIL_TO,
        env.VITE_EMAIL,
        env.CONTACT_EMAIL,
        env.CONTACT_RECEIVER_EMAIL,
        env.EMAIL_CONTACT,
        env.EMAIL_TO,
        env.PORTFOLIO_CONTACT_EMAIL,
        env.SUPABASE_CONTACT_EMAIL,
        env.SUPABASE_EMAIL,
        env.PUBLIC_CONTACT_EMAIL,
        env.PORTFOLIO_EMAIL,
        env.EMAIL,
    ].find((value) => typeof value === 'string' && value.trim())?.trim() || '';
    return {
        plugins: [react()],
        define: {
            __PORTFOLIO_CONTACT_EMAIL__: JSON.stringify(contactEmail),
        },
    };
});
