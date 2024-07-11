import { useEffect, useState } from "react"
import { BlockList } from "../components/BlockList"
import { blockService } from "../services/block.service"

export const Lobby = () => {
    const [blocks, setBlocks] = useState([])

    useEffect(() => {
        loadBlocks()
    }, [])

    const loadBlocks = async () => {
        try {
            const blocks = await blockService.query()
            setBlocks(blocks)
        } catch (error) {
            console.log('Error loading blocks', error)
        }
    }

    return (
        <div>
            Lobby
            <BlockList blocks={blocks}/>
        </div>
    )
}