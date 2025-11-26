"use client";

import AuthForm from '@/components/AuthForm';
import { signupSchema } from '@/lib/validations';

const Page = () => (
    <AuthForm 
        type="SIGN_UP"
        schema={signupSchema}
        defaultValues={{ full_name: "", email: "", password: "" }}

        onSubmit={async () => ({ success: true })}
    />
)

export default Page;