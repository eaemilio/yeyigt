import '../styles/globals.css';
import { SessionContext } from '../lib/context';
import { useAuthSession } from '../lib/hooks';
import Head from 'next/head';
import Dashboard from '../components/dashboard/Dashboard';
import { Toaster } from 'react-hot-toast';
import AuthCheck from '../components/AuthCheck';

function MyApp({ Component, pageProps }) {
    const session = useAuthSession();
    return (
        <div className="h-screen">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                <link
                    href="https://fonts.googleapis.com/css2?family=DM+Sans&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <SessionContext.Provider value={{ session }}>
                <Dashboard>
                    <AuthCheck>
                        <Component {...pageProps} />
                        <Toaster position="bottom-right" />
                    </AuthCheck>
                </Dashboard>
            </SessionContext.Provider>
        </div>
    );
}

export default MyApp;
