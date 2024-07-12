import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { blockService } from "../services/block.service"
import { SOCKET_EVENT_JOIN, socketService } from "../services/socket.service"

export const CodeBlock = () => {
    const { blockId } = useParams()
    const [role, setRole] = useState('')
    const [block, setBlock] = useState(null)
    const [usersCount, setUsersCount] = useState(0)

    useEffect(() => {
        loadBlock()
    }, [])

    useEffect(() => {
        socketService.emit(SOCKET_EVENT_JOIN, blockId)
        socketService.on('setRole', setRole)
        socketService.on('mentorLeft', onMentorLeave)
        socketService.on('updateUsers', setUsersCount)

        return () => {
            socketService.emit('leave', blockId)
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

    const onMentorLeave = () => {
        alert('The mentor has left. Redirecting to the lobby.')
        window.location.href = '/' // Redirect to the lobby
    }

    if (!block) return <div>Loading...</div>

    return (
        <>
            <div>CodeBlock title: {block.title}</div>
            <div>Users: {usersCount}</div>
        </>
    )
}