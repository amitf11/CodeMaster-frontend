import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import Editor from '@monaco-editor/react'
import { utilService } from '../services/util.service'
import { blockService } from "../services/block.service"
import { socketService } from "../services/socket.service"
import useAlert from "../custom hooks/useAlert"

export const CodeBlock = () => {
    const [role, setRole] = useState('')
    const [code, setCode] = useState('')
    const [block, setBlock] = useState(null)
    const [usersCount, setUsersCount] = useState(0)

    const navigate = useNavigate()
    const { blockId } = useParams()
    const { showAlert, showConfirm } = useAlert()

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
        showAlert({
            title: 'Alert',
            text: 'The mentor has left. Redirecting to the lobby.',
            icon: 'info'
        })
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
                showAlert({
                    title: 'Success!',
                    text: 'Your solution is correct.',
                    icon: 'success'
                })
            } else {
                showAlert({
                    title: 'Wrong Answer!',
                    text: 'Your solution is incorrect. Please try again.',
                    icon: 'error'
                })
            }
        } catch (error) {
            console.error('Error evaluating code', error)
            showAlert({
                title: 'Error',
                text: 'Had trouble evaluating code. Please check your solution.',
                icon: 'question'
            })
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