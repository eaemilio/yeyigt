import Account from '../components/Account';
import AuthCheck from '../components/AuthCheck';
import { SessionContext } from '../lib/context';
import { useAuthSession } from '../lib/hooks';

export default function Profile() {
    const session = useAuthSession(SessionContext);

    return (
        <AuthCheck>
            {session && session.user ? <Account key={session.user.id} session={session} /> : <div></div>}
        </AuthCheck>
    );
}
