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
        <section className="flex column align-center main-lobby-container">
            <h1>Welcome to Tom's Coding Academy Lobby!</h1>
            <div>Select a code block below to start coding.</div>
            <BlockList blocks={blocks} />
        </section>
    )
}