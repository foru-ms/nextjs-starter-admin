import Meta from '@/components/Meta/index';
import Navbar from '@/components/Navbar';

const Support = () => {
    return (
        <>
            <Meta title="Admin Foru.ms" />
            <div className="flex flex-no-wrap">
                <div className="w-full">
                    <Navbar models={['thread', 'post', 'user']} />
                </div>
            </div>
        </>
    );
}

export default Support;