import Link from 'next/link';
import { useContext } from 'react';
import { SessionContext } from '../lib/context';

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
    const { session } = useContext(SessionContext);

    return session ? props.children : props.fallback || <Link href="/">You must be signed in</Link>;
}
