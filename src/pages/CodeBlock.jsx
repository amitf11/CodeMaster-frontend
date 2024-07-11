import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { blockService } from "../services/block.service"

export const CodeBlock = () => {
    const { blockId } = useParams()
    const [block, setBlock] = useState(null)

    useEffect(() => {
        loadBlock()
    }, [])

    const loadBlock = async () => {
        try {
            const block = await blockService.getById(blockId)
            setBlock(block)
            console.log('block:', block)
        } catch (error) { //TODO: Improve error handling
            console.log('Error loading block', error)
        }
    }

    if (!block) return <div>Loading...</div>

    return (
        <div>
            CodeBlock ID: {block._id}
            CodeBlock title: {block.title}
            CodeBlock code: {block.code}
        </div>
    )
}