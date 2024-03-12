"use client"
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { FaUserCircle } from "react-icons/fa";

export default function Board() {
    const [boardData, setBoardData] = useState(null);
    const params = useParams();
    let pathname = Array.isArray(params.board) ? params.board[0] : params.board;
    pathname = decodeURIComponent(pathname);

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const q = query(
                    collection(db, 'moodboards'),
                    where('name', '==', pathname)
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const boardDocSnapshot = querySnapshot.docs[0];
                    const data = boardDocSnapshot.data();
                    const { creator, posts, name, banner } = data;

                    // Fetch creator data from the 'users' collection
                    const creatorDocRef = doc(db, 'users', creator);
                    const creatorDocSnapshot = await getDoc(creatorDocRef);
                    const creatorData = creatorDocSnapshot.data();

                    // Fetch posts data from the 'posts' collection
                    const postsData = await Promise.all(
                        posts.map(async (postId) => {
                            const postDocRef = doc(db, 'posts', postId);
                            const postDocSnapshot = await getDoc(postDocRef);
                            return postDocSnapshot.data();
                        })
                    );

                    setBoardData({name, banner, creator: creatorData, posts: postsData, name, banner });
                } else {
                    console.log('No matching document found');
                }
            } catch (error) {
                console.error('Error fetching board data:', error);
            }
        };

        fetchBoardData();
    }, [pathname]);

    if (!boardData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div className='w-full h-[40vh] relative'>
                {/* <div className='absolute w-full h-full flex justify-center items-center z-20'>
                    <div className='px-6 py-3 rounded-full backdrop-blur-xl drop-shadow-xl text-center'>
                        <h1 className='text-4xl font-bold'>{boardData.name}</h1>
                        <p className='italic'>By {boardData.creator.name}</p>
                    </div>
                </div> */}
                {/* <div className='absolute w-full z-20'>
                    <Navbar />
                </div> */}
                <div className='bg-gradient-to-t from-black to-transparent to-90% h-full w-full absolute z-10'/>
                <img src={boardData.banner} className='w-full h-full object-cover'/>
            </div>
            <div className='relative bottom-14 z-10 w-fit mx-auto flex flex-col items-center'>
                <img src={boardData.creator.profileImg} width={500} height={500} className='w-[110px] rounded-full mb-4'/>
                <h1 className='font-semibold text-3xl mb-2'>{boardData.name}</h1>
                <div className='text-[#828282] flex items-center gap-1'>
                    <FaUserCircle />
                    <p className='font-semibold'>{boardData.creator.name}</p>
                </div>
            </div>
            <div className='p-10'>
                {boardData.posts.map((post, index) => (
                    <div key={index} className='flex gap-8 relative bottom-14 flex-wrap'>
                        <img src={post.image} width={300} height={0} className='rounded-3xl h-[300px] object-cover'/>
                    </div>
                ))}
            </div>
            
        </div>
        // <>
        //     <p>Name: {boardData.name}</p>
        //     <p>Banner: {boardData.banner}</p>

        //     <p>Creator:</p>
        //     <ul>
        //         <li>Email: {boardData.creator.email}</li>
        //         <li>Name: {boardData.creator.name}</li>
        //         <li>Profile Image: {boardData.creator.profileImg}</li>
        //     </ul>

        //     <p>Posts:</p>
        //     <ul>
        //         {boardData.posts.map((post, index) => (
        //             <li key={index}>
        //                 <p>Title: {post.title}</p>
        //                 <p>Image: {post.image}</p>
        //             </li>
        //         ))}
        //     </ul>
        // </>
    );
}
