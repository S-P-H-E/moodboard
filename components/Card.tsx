import Link from "next/link";

export default function Card({post}: {post: any}) {
    return (
        <Link href={`/posts/${post.id}`} className='h-fit flex flex-col items-center relative'>
            <img src={post.image} width={0} height={0} className='rounded-3xl h-[300px] w-fit object-cover'/>
            <div className='flex flex-col gap-2 p-5 absolute bg-gradient-to-t from-black to-transparent justify-end h-full w-full transition-all opacity-0 hover:opacity-100'>
                <h1 className='text-xl font-medium'>
                {post.title}
                </h1>
                <div className='flex gap-3'>
                {/* <img src={item.AuthorImg} width={30} height={0} className='rounded-full'/> */}
                <p className='bg-white text-black px-2 py-1 font-semibold rounded-full'>{post.tag}</p>
                </div>
            </div>
        </Link>
    )
}