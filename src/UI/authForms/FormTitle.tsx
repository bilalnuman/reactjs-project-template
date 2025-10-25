import { CardHeader } from '@heroui/react';
import React from 'react'

interface Props {
    title: string;
    subTitle?: string;
    className?: string
}

const FormTitle = ({ title, subTitle, className }: Props) => {
    return (
        <CardHeader className={className}>
            <div className="flex items-center gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    {subTitle && <p>{subTitle}</p>}
                </div>
            </div>
        </CardHeader>
    )
}

export default FormTitle