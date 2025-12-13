"use client";

import React from 'react';
import AuthForm from '@/components/AuthForm';
import { signUp } from '@/lib/actions/auth';
import { signupSchema } from '@/lib/validations';

const SignUpPage = () => {
    return (
        <AuthForm 
            type="SIGN_UP"
            schema={signupSchema}
            defaultValues={{ 
                full_name: "", 
                email: "", 
                password: "", 
                confirm_password: "",
                bios: "", 
                phone: "", 
                waiver_signed: false, 
                competitor_type: "RIDER", 
                address: "", 
                city: "", 
                state: "", 
                zip: "" 
            }}
            onSubmit={signUp}
        />
    );
};

export default SignUpPage;