import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { blockService } from "../services/block.service"
import { socketService } from "../services/socket.service"

import useAlert from "../custom hooks/useAlert"
import { BlockList } from "../components/BlockList"

export const Lobby = () => {
    const navigate = useNavigate()
    const [blocks, setBlocks] = useState([])
    const { showConfirmation } = useAlert()

    useEffect(() => {
        loadBlocks()
        socketService.on('invite', onInvite)

        return () => {
            socketService.off('invite')
        }
    }, [])

    const loadBlocks = async () => {
        try {
            const blocks = await blockService.query()
            setBlocks(blocks)
        } catch (error) {
            console.log('Error loading blocks', error)
        }
    }

    const onInvite = ({ blockId }) => {
        showConfirmation({
            title: 'Invitation',
            text: 'The mentor has invited you to join their room. Would you like to join?',
            icon: 'info'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(`/block/${blockId}`)
            }
        })
    }

    return (
        <section className="flex column align-center main-lobby-container">
            <h1>Welcome to Tom's Coding Academy Lobby!</h1>
            <div>Select a code block below to start coding.</div>
            <BlockList blocks={blocks} />
        </section>
    )
}