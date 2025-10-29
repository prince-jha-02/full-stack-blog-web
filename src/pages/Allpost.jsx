import React, { useEffect, useState } from 'react'
import {Container, PostCard} from '../components'
import appwriteService from '../appwrite/config'

function Allpost() {
    const [posts, setPosts] = useState([])
    
    useEffect(() => {
        appwriteService.getPosts([]).then((posts) => {  // ✅ Moved inside useEffect
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])  // ✅ Empty dependency array
    
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />  {/* ✅ Changed from post={post} to {...post} */}
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Allpost