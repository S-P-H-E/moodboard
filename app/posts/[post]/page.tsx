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
    title: string;
    image: string;
    creator: string;
    banner: string;
    description: string;
    link: string;
    tag: string;
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
                            title: data.title || '',
                            image: data.image || '',
                            creator: data.creator || '',
                            banner: data.banner || '',
                            description: data.description || '',
                            link: data.link || '',
                            tag: data.tag || ''
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
            <div className='w-[1000px] flex mx-auto rounded-[1.5rem] shadow-2xl border border-[--border]'>
                <div className='w-[900px] relative bg-blue-500'>
                    <img src={contentData?.image ?? ''} width={1000} height={0} className='rounded-l-2xl w-full' />
                    <div className='absolute z-10 bg-red-500'>
                        <Link href={`/board/${contentData?.creator}`}>
                            <div className='font-semibold bg-[--foreground] rounded-full text-[--background] px-4 py-1 w-fit'>
                                <h1>
                                    View Image
                                </h1>
                            </div>
                        </Link>
                    </div>
                </div>
                
                <div className='p-5 flex flex-col justify-between w-full'>
                    <div className='flex flex-col gap-2 justify-between h-full'>
                        {/* <div className='pb-4 flex justify-between items-center w-full'>

                        </div> */}
                        <div>
                            <h1 className='text-4xl font-medium'>{contentData?.title}</h1>
                            <p className='text-[--gray]'>{contentData?.description}</p>
                        </div>

                        <Link href={`/board/${contentData?.creator}`}>
                            <h1 className='text-sm font-semibold bg-[--foreground] rounded-full text-[--background] px-4 py-1 w-fit'>{contentData?.creator}</h1>
                        </Link>
                    </div>
                    {/* <div className='flex gap-3'>
                        <Image src={contentData?.AuthorImg ?? ''} width={50} height={0} className='rounded-full' alt='img'/>
                        <div>
                            <p className='text-md font-semibold'>{contentData?.Author}</p>
                            <p className='text-md text-[--gray]'>Author</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}
