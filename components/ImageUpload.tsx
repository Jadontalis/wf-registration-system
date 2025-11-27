"use client";
import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next';
import config from '@/lib/config';
import { useRef, useState } from "react";

const authenticator = async () => {
    try 
    {
        const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status code ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, token, expire } = data;
        
        return { signature, token, expire };
    } 
        catch (error) 
    {
        if (error instanceof Error) {
            throw new Error(`Authentication request failed :( : ${error.message})`);
        }
        throw new Error(`Authentication request failed :( : ${String(error)})`);
    }
}

const onError = () => {};
const onSuccess = () => {};

const ImageUpload = () => 
{
    const ikUploadRef= useRef(null);
    const [file, setFile] = useState<{ filepath: string } | null> (null);
    
    return <ImageKitProvider publicKey={config.env.imagekit.publicKey!} urlEndpoint={config.env.imagekit.urlEndpoint!} authenticator={authenticator}>
        <IKUpload className='hidden' ref={ikUploadRef} onError={onError} onSuccess={onSuccess} />
        
        {/* Implementation of adding upload image button and displaying uploaded image to user, if need be */}
        
    </ImageKitProvider>
}

export default ImageUpload