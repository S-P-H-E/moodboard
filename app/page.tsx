"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/utils/firebase';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Post {
  id: string;
  title: string;
  // author: string;
  // authorImg: string;
  image: string;
  moodboard: string;
}


export default function Home() {
  const [content, setContent] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const posts: Post[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Post; // Explicitly cast to the Post type
          posts.push({
            id: doc.id,
            title: data.title || '',
            // author: data.author || '',
            // AuthorImg: data.AuthorImg || '',
            image: data.image || '',
            moodboard: data.moodboard || '',
          });
        });
        setContent(posts);
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
    };

    fetchData();
  }, []);

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  return (
    <>
      <Navbar />

      {/* Dashboard */}
      <div className='grid md:grid-cols-5 gap-y-3 gap-3 px-10'>
        {content.map((item, index) => (
          <Link key={index} href={`/posts/${item.id}`} className={`h-fit flex flex-col items-center`}>
            <img src={item.image} width={300} height={0} className='rounded-3xl h-[300px] object-cover'/>
            <div className='flex flex-col gap-2 m-2'>
              {/* <h1 className='text-xl font-medium'>
                {truncateText(item.title, 25)}
              </h1> */}
              {/* <div className='flex gap-3'>
                <img src={item.AuthorImg} width={30} height={0} className='rounded-full'/>
                <p>{item.Author}</p>
              </div> */}
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}