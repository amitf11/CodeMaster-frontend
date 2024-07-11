import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { blockService } from "../services/block.service"
import { SOCKET_EVENT_JOIN, socketService } from "../services/socket.service"

export const CodeBlock = () => {
    const { blockId } = useParams()
    const [block, setBlock] = useState(null)
    const [role, setRole] = useState('')

    useEffect(() => {
        loadBlock()
    }, [])

    useEffect(() => {
        socketService.emit(SOCKET_EVENT_JOIN, { blockId })

        socketService.on('setRole', (assignedRole) => {
            setRole(assignedRole)
            console.log('role:', assignedRole)
        })

        socketService.on('mentorLeft', () => {
            if (!role) {
                alert('The mentor has left. Redirecting to the lobby.')
                window.location.href = '/' // Redirect to the lobby
            }
        })

        return () => {
            socketService.emit('leave', { blockId })
            socketService.off('setRole')
            socketService.off('mentorLeft')
        }
    }, [blockId])

    const loadBlock = async () => {
        try {
            const block = await blockService.getById(blockId)
            setBlock(block)
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