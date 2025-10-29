import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'
import { ID } from 'appwrite'

function PostCard({$id, title, featuredImage, slug}) {  // ✅ Added slug parameter
  return (
    <Link to={`/post/${$id}`}>  {/* ✅ Changed from $id to slug */}
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
                {featuredImage ? (
                    <img 
                        src={appwriteService.getFilePreview(featuredImage)} 
                        alt={title} 
                        className='rounded-xl'
                    />
                ) : (
                    <div className='w-full h-48 bg-gray-300 rounded-xl flex items-center justify-center'>
                        <span className='text-gray-500'>No Image</span>
                    </div>
                )}
            </div>
            <h2 className='text-xl font-bold'>{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard