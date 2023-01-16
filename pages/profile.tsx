import Account from '../components/Account';
import AuthCheck from '../components/AuthCheck';

export default function Profile() {
    return (
        <AuthCheck>
            <Account />
        </AuthCheck>
    );
}
