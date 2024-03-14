"use client"
import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';

interface Post {
  id: string;
  title: string;
  tag: string;
  image: string;
}

export default function Home() {
  const [content, setContent] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = onSnapshot(collection(db, 'posts'), (querySnapshot) => {
          const posts: Post[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as Post;
            posts.push({
              id: doc.id,
              title: data.title || '',
              tag: data.tag || '',
              image: data.image || '',
            });
          });
          setContent(posts);
        });
  
        // Return a cleanup function to unsubscribe from the snapshot listener
        return () => unsubscribe();
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
      {/* <div className='w-fit mx-auto text-center p-10 flex flex-col gap-2'>
        <h1 className='text-5xl font-semibold'>Moodboard</h1>
        <p>The best place to create your dream life and view the dream life of others</p>
      </div> */}
      <Navbar />
      {/* Dashboard */}
      <div className='flex flex-wrap gap-3 px-10'>
        {content.map((item, index) => (
          <Card key={index} post={item} />
        ))}
      </div>
    </>
  )
}