import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../lib/context';
import Auth from './Auth';

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
    const { session } = useContext(SessionContext);
    const [isSignedIn, setIsSignedIn] = useState(true);

    useEffect(() => {
        setIsSignedIn(!!session.access_token);
    }, [session]);

    return isSignedIn ? props.children : props.fallback || <Auth></Auth>;
}
