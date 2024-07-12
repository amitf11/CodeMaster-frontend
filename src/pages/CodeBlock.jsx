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
        socketService.on('codeUpdate', setCode)
        socketService.on('mentorLeft', onMentorLeave)
        socketService.on('updateUsers', setUsersCount)

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
        try {
            if (utilService.evaluateCode(code, block.solution, block.tests)) {
                // socketService.emit('codeSubmit', { blockId, success: true })
                alert('Success! Your solution is correct.')
            } else {
                alert('Your solution is incorrect. Please try again.')
            }
        } catch (error) {
            console.error('Error evaluating code', error)
            alert('Error evaluating code. Please check your solution.')
        }
    }
    

    if (!block) return <div>Loading...</div>

    return (
        <section className='code-block-container'>
            <div className='flex space-between'>
                <div> {/*TODO: Move all these to a component */}
                    <h1>{block.title} <span className={block.difficulty + ' difficulty-span'}>{block.difficulty}</span></h1>
                    <h3>Instructions:</h3>
                    <p>{block.description}</p>
                </div>
                <div className='flex column align-center'>
                    <div>Welcome {role === 'mentor' ? 'Tom' : 'Student'}!</div>
                    <div>Users: {usersCount}</div>
                </div>
            </div>
            <div>
                <button onClick={() => navigate('/')}>Back</button>
                <button>Hint</button>
                {role === 'student' && <button onClick={handleSubmit}>Submit</button>}
            </div>
            <Editor
                className='editor'
                height="400px"
                width="70%"
                language="javascript"
                value={code}
                theme="vs-dark"
                onChange={handleCodeChange}
                options={{
                    fontSize: 16,
                    readOnly: role === 'mentor'
                }} />
        </section>
    )
}