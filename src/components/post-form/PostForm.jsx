import React,{ useCallback, useState} from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {Input,Select,RTE,Button} from '../index'
import appwriteService from '../../appwrite/config'

import { useSelector } from 'react-redux'

export default function PostForm({post}) {
    const [imagePreview, setImagePreview] = useState(null);
    
    const {register,handleSubmit,watch,setValue,control,getValues}=useForm({
        defaultValues:{
            title:post?.title||'',
            slug:post?.slug||'',
            content:post?.content||'',
            status:post?.status||'active'
        }
    })
    const navigate=useNavigate()
    const userData=useSelector(state=>state.auth.userData)
    
    const submit = async(data) => {
    if (!userData?.$id) {
        alert("You must be logged in to create a post");
        return;
    }

    if (post) {
        const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

        if (file) {
            appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatepost(post.$id, {
            ...data,
            featuredImage: file ? file.$id : post.featuredImage,
        });

        if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
        }
    } else {
        const file = await appwriteService.uploadFile(data.image[0]);

        if (file) {
            const fileId = file.$id;
            
            const postData = {
                title: data.title,
                slug: data.slug,
                content: data.content,
                featuredImage: fileId,
                status: data.status,
                userid: userData.$id
            };
            
            console.log("Creating post with data:", postData);
            
            const dbPost = await appwriteService.createpost(postData);
            
            console.log("Created post response:", dbPost); // ✅ Add this
            console.log("Post $id:", dbPost?.$id); // ✅ Add this
            console.log("Post slug:", dbPost?.slug); // ✅ Add this

            if (dbPost) {
                // Use slug instead of $id for navigation
                navigate(`/post/${dbPost.$id}`); // ✅ Changed from $id to slug
            }
        }
    }
}
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const slugTransform =useCallback((value)=>{
        if(value&&typeof value==='string'){
            return value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')  
            .replace(/^-+|-+$/g, '');       
        }
        return ''
    },[])
    
    React.useEffect(()=>{
        const subscription=watch((value,{name})=>{
            if(name==='title'){
                setValue('slug',slugTransform(value.title),{shouldValidate:true})
            }
        })
        return ()=>{
            subscription.unsubscribe()
        }
    },[watch,slugTransform,setValue])
    
    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                    onChange={(e) => {
                        register("image").onChange(e);
                        handleImageChange(e);
                    }}
                />
                {imagePreview ? (
                    <div className="w-full mb-4">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="rounded-lg"
                        />
                    </div>
                ) : post && post.featuredImage ? (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                ) : null}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}