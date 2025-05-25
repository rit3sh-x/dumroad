import React from 'react'

interface Props {
    params: Promise<{
        category: string;
        subcategory: string;
    }>
}

async function Subcategory({ params }: Props) {
    const { category, subcategory } = await params;

    return (
        <div>Subcategory</div>
    )
}

export default Subcategory