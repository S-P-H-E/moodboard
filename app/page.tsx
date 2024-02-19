"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/utils/firebase';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Post {
  id: string;
  Title: string;
  Author: string;
  AuthorImg: string;
  Image: string;
  Moodboard: string;
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
            Title: data.Title || '',
            Author: data.Author || '',
            AuthorImg: data.AuthorImg || '',
            Image: data.Image || '',
            Moodboard: data.Moodboard || '',
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
      <div className='p-10 grid md:grid-cols-5 gap-y-3 gap-3'>
        {content.map((item, index) => (
          <Link key={index} href={`/posts/${item.id}`} className={`h-fit flex flex-col items-center`}>
            <img src={item.Image} width={300} height={0} className='rounded-3xl h-[300px] object-cover'/>
            <div className='flex flex-col gap-2 m-2'>
              <h1 className='text-xl font-medium'>
              {truncateText(item.Title, 25)}
              </h1>
              <div className='flex gap-3'>
                <img src={item.AuthorImg} width={30} height={0} className='rounded-full'/>
                <p>{item.Author}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
