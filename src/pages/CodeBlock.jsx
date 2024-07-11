import { useParams } from "react-router-dom"

export const CodeBlock = () => {
    const { blockId } = useParams()
    
    return (
        <div>CodeBlock ID: {blockId}</div>
    )
}