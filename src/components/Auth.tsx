import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export function Auth() {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('chautrancmt26@gmail.com');
    const [password, setPassword] = useState('0189');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Logged in successfully!');
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (loading && !user) return <div className="p-4 text-center">Loading Auth...</div>;

    if (user) {
        return (
            <div className="flex items-center gap-4 p-4 bg-white/40 dark:bg-zinc-900/40 coffee-light:bg-white/60 coffee-dark:bg-black/40 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/10 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                    <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 coffee-light:text-[#452B1F] coffee-dark:text-[#f4ece1] truncate">{user.email}</p>
                    <button
                        onClick={handleLogout}
                        className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                        <LogOut className="w-3 h-3" /> Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleLogin} className="p-8 bg-white/40 dark:bg-zinc-900/40 coffee-light:bg-white/60 coffee-dark:bg-black/40 backdrop-blur-md rounded-[2.5rem] border border-zinc-200 dark:border-white/10 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10 space-y-6 max-w-sm mx-auto shadow-sm">
            <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 coffee-light:text-[#452B1F] coffee-dark:text-[#f4ece1] flex items-center gap-2">
                    <LogIn className="w-5 h-5" /> Account
                </h2>
                <p className="text-sm text-zinc-500 coffee-light:text-[#452B1F]/60 coffee-dark:text-[#f4ece1]/60">Login to sync your data.</p>
            </div>

            <div className="space-y-3">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3 bg-white/50 dark:bg-black/20 coffee-light:bg-[#452B1F]/5 coffee-dark:bg-white/5 border border-zinc-200 dark:border-white/10 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10 rounded-2xl text-zinc-900 dark:text-white coffee-light:text-[#452B1F] coffee-dark:text-[#f4ece1] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-zinc-400"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3 bg-white/50 dark:bg-black/20 coffee-light:bg-[#452B1F]/5 coffee-dark:bg-white/5 border border-zinc-200 dark:border-white/10 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10 rounded-2xl text-zinc-900 dark:text-white coffee-light:text-[#452B1F] coffee-dark:text-[#f4ece1] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-zinc-400"
                    required
                />
            </div>

            {message && <p className={`text-xs text-center transition-all ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-zinc-900 dark:bg-white coffee-light:bg-[#452B1F] coffee-dark:bg-[#f4ece1] text-white dark:text-black coffee-light:text-white coffee-dark:text-[#452B1F] font-bold rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
                {loading ? 'Processing...' : 'Login'}
            </button>
        </form>
    );
}
