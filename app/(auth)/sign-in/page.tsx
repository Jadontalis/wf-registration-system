"use client";

import AuthForm from '@/components/AuthForm';
import { signinSchema } from '@/lib/validations';

const Page = () => (
    <AuthForm 
        type="SIGN_IN"
        schema={signinSchema}
        defaultValues={{ email: "", password: "" }}

        onSubmit={async (data) => {
            return { sucess: true };
        }}
    />
)

export default Page;