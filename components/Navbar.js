import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = ({ models }) => {
    const router = useRouter();

    return (
        <nav className="bg-gray-200">
            <ul className="flex space-x-4">
                {models.map((model) => (
                    <li key={model}>
                        <Link href={`/${model}`} className={`py-2 px-4 rounded ${router.asPath === `/${model}` ? 'bg-blue-500 text-white' : 'text-gray-800'}`}>
                                {model.charAt(0).toUpperCase() + model.slice(1) + 's'}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
