"use client";

import AuthForm from '@/components/AuthForm';
import { signUp } from '@/lib/actions/auth';
import { signupSchema } from '@/lib/validations';

const Page = () => (
    <AuthForm 
        type="SIGN_UP"
        schema={signupSchema}
        defaultValues={{ full_name: "", email: "", password: "", bios: "", phone: "", waiver_signed: false, competitor_type: "RIDER", address: "", hometown: "" }}
        onSubmit={signUp}
    />
)

export default Page;