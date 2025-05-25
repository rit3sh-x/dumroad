import React from 'react'

interface Props {
    params: Promise<{
        category: string;
    }>
}

const Category = async ({ params }: Props) => {
    const { category } = await params;
    return (
        <div>Category</div>
    )
}

export default Category