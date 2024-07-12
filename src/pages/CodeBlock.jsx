import Editor from '@monaco-editor/react'
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { blockService } from "../services/block.service"
import { socketService } from "../services/socket.service"
import { utilService } from '../services/util.service'

export const CodeBlock = () => {
    const navigate = useNavigate()
    const { blockId } = useParams()
    const [role, setRole] = useState('')
    const [code, setCode] = useState('')
    const [block, setBlock] = useState(null)
    const [usersCount, setUsersCount] = useState(0)

    useEffect(() => {
        loadBlock()
    }, [])

    useEffect(() => {
        socketService.emit('join', blockId)
        socketService.on('setRole', setRole)
        socketService.on('mentorLeft', onMentorLeave)
        socketService.on('updateUsers', setUsersCount)
        socketService.on('codeUpdate', setCode)

        return () => {
            socketService.emit('leave', blockId)
            socketService.off('setRole')
            socketService.off('codeUpdate')
            socketService.off('mentorLeft')
            socketService.off('updateUsers')
        }
    }, [blockId])

    const loadBlock = async () => {
        try {
            const block = await blockService.getById(blockId)
            setBlock(block)
            setCode(block.initialCode)
        } catch (error) { //TODO: Improve error handling
            console.log('Error loading block', error)
        }
    }

    const onMentorLeave = () => {
        alert('The mentor has left. Redirecting to the lobby.')
        navigate('/') // Redirect to the lobby
    }

    const handleCodeChange = (value) => {
        setCode(value)
        socketService.emit('codeChange', { blockId, code: value })
    }

    const handleSubmit = () => {
        // socketService.emit('submitCode', { blockId, code })
    }


    if (!block) return <div>Loading...</div>

    return (
        <>
            <div>CodeBlock title: {block.title}</div>
            <div>Users: {usersCount}</div>
            <div>Welcome {role}!</div>
            <button onClick={() => navigate('/')}>Back</button>
            {role === 'student' && <button onClick={handleSubmit}>Submit</button>}
            <Editor
                height="400px"
                language="javascript"
                value={code}
                theme="vs-dark"
                onChange={handleCodeChange}
                options={{
                    fontSize: 16,
                    readOnly: role === 'mentor'
                }} />
        </>
    )
}