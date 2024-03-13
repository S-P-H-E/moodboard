"use client"
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { FaUserCircle } from "react-icons/fa";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebase';
import Link from 'next/link';
import Card from '@/components/Card';

export default function Board() {
    const [boardData, setBoardData] = useState(null);
    const [postsData, setPostsData] = useState([]);
    const params = useParams();
    let pathname = Array.isArray(params.board) ? params.board[0] : params.board;
    pathname = decodeURIComponent(pathname);
    const [user] = useAuthState(auth);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user) {
                    const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
                    const userQuerySnapshot = await getDocs(userQuery);
                    if (!userQuerySnapshot.empty) {
                        const userData = userQuerySnapshot.docs[0].data();
                        setBoardData(userData);

                        // Fetch additional details for each post
                        const posts = userData.posts || [];
                        const postsPromises = posts.map(async postId => {
                            const postDoc = doc(db, 'posts', postId);
                            const postSnapshot = await getDoc(postDoc);
                            if (postSnapshot.exists()) {
                                // Include the document ID in the post data
                                return {
                                    id: postId,
                                    ...postSnapshot.data()
                                };
                            }
                            return null;
                        });
                        const postsData = await Promise.all(postsPromises);
                        setPostsData(postsData.filter(post => post !== null));
                    } else {
                        console.log('No user document found for the logged-in user.');
                    }
                } else {
                    console.log('No user logged in');
                }
            } catch (error) {
                console.error('Error getting user document:', error);
            }
        };
        fetchUserData();
    }, [user]);

    return (
        <div>
            <div className='w-full h-[40vh] relative'>
                {/* <div className='absolute w-full z-20'>
                    <Navbar />
                </div> */}
                <div className='bg-gradient-to-t from-black to-transparent to-90% h-full w-full absolute z-10'/>
                <img src={boardData?.banner} className='w-full h-full object-cover'/>
            </div>
            <div className='relative bottom-14 z-10 w-fit mx-auto flex flex-col items-center'>
                <img src={boardData?.profileImg} width={500} height={500} className='w-[110px] rounded-full mb-4'/>
                <h1 className='font-semibold text-3xl mb-2'>{boardData?.name}</h1>
                <div className='text-[#828282] flex items-center gap-1'>
                    <FaUserCircle />
                    <p className='font-semibold'>{boardData?.name}</p>
                </div>
            </div>
            <div className='p-10 flex flex-wrap gap-3'>
                {boardData && boardData.posts && postsData.map((post, index) => (
                    <Card key={index} post={post} />
                ))}
            </div>
        </div>
    );
}
