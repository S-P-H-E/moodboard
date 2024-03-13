"use client"
import { FaMagnifyingGlass } from 'react-icons/fa6';
import Logo from '@/public/logo.png'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes'
import clsx from 'clsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebase';
import { db, storage } from '@/utils/firebase';
import { useEffect, useState } from 'react';
import { MdAdd } from "react-icons/md";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { FaImage } from "react-icons/fa6";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Progress, message } from 'antd';
import { addDoc, collection } from 'firebase/firestore';
  
export default function Navbar() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user] = useAuthState(auth);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [moodboard, setMoodboard] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [postImageUrl, setPostImageUrl] = useState<string | null>(null);

    const onImageDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        try {
            if (!file.type.includes('image')) {
                setFileError('Invalid file type. Please select an image file.');
                return;
            }
            if (file.size > 20 * 1024 * 1024) {
                setFileError('File size exceeds the limit (20MB).');
                return;
            }

            const storageRef = ref(storage, `posts/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('Error uploading image:', error);
                    message.error('Failed to upload image.');
                },
                () => {
                    message.success('Image uploaded successfully.');
                    getDownloadURL(storageRef).then((url) => {
                        setPostImageUrl(url);
                    }).catch((error) => {
                        console.error('Error getting download URL:', error);
                        message.error('Failed to get download URL.');
                    });
                }
            );
        } catch (error) {
            console.error('Error uploading image:', error);
            message.error('Failed to upload image.');
        }
    };

    const handleSubmit = async () => {
        if (!title || !selectedTag) {
            message.error('Please fill in all required fields.');
            return;
        }
    
        if (!moodboard) {
            const moodboardRef = collection(db, 'moodboards');
            const newMoodboardDoc = await addDoc(moodboardRef, {
                banner: '',
                creator: user.uid, // Assuming user is logged in and you want to store the UID of the creator
                name: moodboard,
                posts: [],
            });
            setMoodboard(newMoodboardDoc.id);
        }
    
        const postsRef = collection(db, 'posts');
        addDoc(postsRef, {
            title,
            description,
            link,
            moodboard,
            tag: selectedTag,
            image: postImageUrl, // Set the image field to the postImageUrl
            
        }).then(() => {
            message.success('Post created successfully.');
            setTitle('');
            setDescription('');
            setLink('');
            setSelectedTag('');
            setMoodboard('');
            setPostImageUrl(null); // Reset postImageUrl after submission
        }).catch((error) => {
            console.error('Error creating post:', error);
            message.error('Failed to create post.');
        });
    };
    

    const tags = [
        { name: 'Cars' },
        { name: 'Mansions' },
        { name: 'Private Jets' },
        { name: 'Yachts' },
        { name: 'Watches' },
    ];

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onImageDrop,
        maxSize: 20 * 1024 * 1024, // 20MB
    });

    return (
        <>
        {/* Navbar */}
        <div className='p-10 flex flex-col gap-3'>
            <div className='flex items-center h-[50px] gap-5'>
                {/* <Image src={Logo} width={20} height={0} className='invert' alt='logo'/> */}
                {/* <Link href='/'>
                    <div className={clsx('text-[--foreground] py-3 px-4 rounded-xl font-semibold bg-[--border] shadow-xl', fullpath === '/' && 'bg-[--foreground] text-[--background]')}>
                        <img src="/logo.png" width={30} className='invert w-[30px] mx-auto'/>
                    </div>
                </Link> */}
                {/* <button className='text-[--foreground] px-4 py-3 rounded-full font-semibold w-[110px] border border-[--border]' onClick={() => setTheme(clsx(theme === 'light' ? 'dark' : 'light'))}>
                    {theme === 'light' ? (
                        'Dark'
                    ) : (
                        'Light'
                    )}
                </button> */}
                <div className='backdrop-blur-xl shadow-xl w-full rounded-xl flex items-center py-4 px-6 gap-2 h-full bg-[--dark-gray] border border-[--stroke]'>
                    <FaMagnifyingGlass className='text-[#767676]'/>
                    <input placeholder='Search' className='placeholder:text-[#757575] bg-transparent w-full h-full outline-none'/>
                </div>
                <Drawer>
                    <DrawerTrigger>
                        <button className='text-[--foreground] px-4 py-3 rounded-xl font-semibold w-[110px] h-full bg-[--dark-gray] border border-[--stroke] flex items-center gap-1'>
                            <MdAdd />
                            Create
                        </button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            {/* <DrawerTitle>Create Post</DrawerTitle> */}
                        </DrawerHeader>
                        <div className='flex items-center justify-between w-[1000px] mx-auto mb-5'>
                            <h1 className='text-3xl font-medium'>Create Post</h1>
                            <div className='flex gap-5'>
                                <DrawerClose>
                                    Cancel
                                </DrawerClose>
                                <button className='text-[--background] px-4 py-3 rounded-xl font-semibold w-[110px] h-full bg-[--foreground]' onClick={handleSubmit}>
                                    Publish
                                </button>
                            </div>
                        </div>
                        <div className='w-fit mx-auto flex items-start h-full gap-7'>
                            <div>
                                {postImageUrl ? (
                                    <img src={postImageUrl} alt="Uploaded Image" className='h-[550px] rounded-3xl'/>
                                ) : (
                                <div {...getRootProps()} className='cursor-pointer'>
                                    <input {...getInputProps()}/>
                                    {
                                        isDragActive ?
                                        <div className='border-4 border-dotted border-blue-500 w-[450px] h-[300px] rounded-2xl p-10 flex flex-col items-center justify-center gap-1'>
                                            <FaImage size={60} className='text-blue-500 mb-3'/>
                                            <h1>Drag & drop your image here or <a className='underline text-blue-500'>choose image</a></h1>
                                            <p className='text-[--gray]'>20 MB max file size</p>
                                        </div>
                                        :
                                        <div className='border-4 border-dotted border-[--stroke] w-[450px] h-[300px] rounded-2xl p-10 flex flex-col items-center justify-center gap-1'>
                                            <FaImage size={60} className='text-[--stroke] mb-3'/>
                                            <h1>Drag & drop your image here or <a className='underline text-blue-500'>choose image</a></h1>
                                            <p className='text-[--gray]'>20 MB max file size</p>
                                        </div>
                                    }
                                </div>
                                )}
                            </div>
                            <div className='h-full flex flex-col gap-7'>
                                <div>
                                    <h1>Title</h1>
                                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Add a title' className='px-4 p-6 mt-2 w-[500px] h-[40px] rounded-xl bg-[--background] border-2 border-[--stroke]'/>
                                </div>
                                <div>
                                    <h1>Description <a className='text-[--gray]'>(optional)</a></h1>
                                    <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Add a detailed description' className='px-4 p-6 mt-2 w-[500px] h-[40px] rounded-xl bg-[--background] border-2 border-[--stroke]'/>
                                </div>
                                <div>
                                    <h1>Link <a className='text-[--gray]'>(optional)</a></h1>
                                    <input value={link} onChange={(e) => setLink(e.target.value)} placeholder='Add a link' className='px-4 p-6 mt-2 w-[500px] h-[40px] rounded-xl bg-[--background] border-2 border-[--stroke]'/>
                                </div>
                                <div>
                                    <h1>Moodboard</h1>
                                    <input value={moodboard} onChange={(e) => setMoodboard(e.target.value)} placeholder='Give your board a name' className='px-4 p-6 mt-2 w-[500px] h-[40px] rounded-xl bg-[--background] border-2 border-[--stroke]'/>
                                </div>
                                <div>
                                    <h1>Tag</h1>
                                    {/* <input placeholder='Pick' className='px-4 p-6 mt-2 w-[500px] h-[40px] rounded-xl bg-[--background] border-2 border-[--stroke]'/> */}
                                    <Select onValueChange={(value) => setSelectedTag(value)}>
                                        <SelectTrigger className='px-4 p-6 mt-2 w-[500px] h-[40px] rounded-xl bg-[--background] border-2 border-[--stroke]'>
                                            <SelectValue placeholder="Pick the tag" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tags.map((tag, index) => (
                                                <div key={index}>
                                                    <SelectItem value={tag.name}>{tag.name}</SelectItem>
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                </div>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>

    
  

                {user ? (
                        // If user is logged in, show the profile picture
                        <img src={user.photoURL || ''} width={500} height={500} className='w-[50px] rounded-full'/>
                    ) : (
                        // If user is not logged in, show a sign-in button
                        <Link href='/login' className='h-full'>
                            <button className='text-[--foreground] px-4 py-2 rounded-xl font-semibold w-[110px] h-full bg-[--dark-gray] border border-[--stroke]'>
                                Sign In
                            </button>
                        </Link>
                    )}
            </div>
            <div className='flex gap-3'>
                {tags.map((tag, index) => (
                    <div key={index} className='flex items-center gap-2 h-[40px] px-4 py-2 rounded-xl bg-[--dark-gray] border border-[--stroke]'>
                        <p>{tag.name}</p>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}