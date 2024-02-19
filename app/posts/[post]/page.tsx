"use client"
import Navbar from '@/components/Navbar';
import { useParams } from 'next/navigation';
import image from '@/public/images/02.jpg'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { BsThreeDots } from "react-icons/bs";
import Link from 'next/link';

interface ContentData {
    Title: string;
    Author: string;
    AuthorImg: string;
    Image: string;
    Moodboard: string;
}

export default function Home() {
    const params = useParams();
    let pathname = Array.isArray(params.post) ? params.post[0] : params.post;
    pathname = decodeURIComponent(pathname);

    const [contentData, setContentData] = useState<ContentData | null>(null);

    useEffect(() => {
        if (pathname) {
            const fetchData = async () => {
                const contentRef = doc(db, 'posts', pathname);
                const contentDoc = await getDoc(contentRef);

                if (contentDoc.exists()) {
                    const data = contentDoc.data();
                    console.log("Firestore Data:", data);

                    if (data) {
                        setContentData({
                            Title: data.Title || '',
                            Author: data.Author || '',
                            AuthorImg: data.AuthorImg || '',
                            Image: data.Image || '',
                            Moodboard: data.Moodboard || '',
                        });
                    }
                }
            };

            fetchData();
        }
    }, [pathname]);

    return (
        <>
            <Navbar />
            <div className='w-[1000px] flex mx-auto rounded-[1.5rem] shadow-2xl border border-[--border] p-7'>
                <Image src={contentData?.Image ?? ''} width={500} height={0} alt='logo' className='rounded-2xl' />
                <div className='p-5 flex flex-col justify-between'>
                    <div>
                        <div className='pb-4 flex justify-between items-center'>
                            <BsThreeDots size={30}/>
                            <Link href={`/${contentData?.Moodboard}`}>
                                <h1 className='text-sm font-semibold bg-[--foreground] rounded-full text-[--background] px-4 py-1'>{contentData?.Moodboard}</h1>
                            </Link>
                        </div>
                        <h1 className='text-3xl font-medium'>{contentData?.Title}</h1>
                    </div>
                    <div className='flex gap-3'>
                        <Image src={contentData?.AuthorImg ?? ''} width={50} height={0} className='rounded-full' alt='img'/>
                        <div>
                            <p className='text-md font-semibold'>{contentData?.Author}</p>
                            <p className='text-md text-[--gray]'>Author</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
