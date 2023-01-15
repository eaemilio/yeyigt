import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../utils/supabaseClient';

export default function Avatar({ url, onUpload, className }) {
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        setAvatarUrl(url);
    }, [url]);

    async function uploadAvatar(event) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                toast.error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            onUpload(filePath);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className={className}>
            <div className="relative w-fit h-fit">
                <label
                    className="justify-center items-center h-40 w-40 rounded-full bg-red-100 cursor-pointer block overflow-hidden relative block"
                    htmlFor="single"
                >
                    {!avatarUrl && (
                        <svg
                            className="w-14 h-14 z-20 fill-white absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                    {avatarUrl && (
                        <Image
                            src={`https://supabase-cdn.vercel.app/api/resize?f=${avatarUrl}&b=avatars&w=1200`}
                            alt="Avatar"
                            className="object-cover"
                            width={150}
                            height={150}
                            layout="responsive"
                        />
                    )}
                </label>
                <input
                    className="absolute hidden"
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    );
}
