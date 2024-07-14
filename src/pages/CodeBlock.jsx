import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { utilService } from "../services/util.service"
import { blockService } from "../services/block.service"
import { socketService } from "../services/socket.service"

import Editor from "@monaco-editor/react"
import useAlert from "../custom hooks/useAlert"

export const CodeBlock = () => {
    const [block, setBlock] = useState(null)
    const [role, setRole] = useState('')
    const [code, setCode] = useState('')
    const [mentorCode, setMentorCode] = useState('')
    const [usersCount, setUsersCount] = useState(0)

    const navigate = useNavigate()
    const { blockId } = useParams()
    const { showAlert } = useAlert()

    useEffect(() => {
        const loadBlock = async () => {
            try {
                const block = await blockService.getById(blockId)
                setBlock(block)
                setCode(block.initialCode)
                setMentorCode(block.initialCode)
            } catch (error) {
                console.log('Error loading block', error)
            }
        }

        loadBlock()

        socketService.emit('join', blockId)
        socketService.on('setRole', setRole)
        socketService.on('mentorLeft', onMentorLeave)
        socketService.on('updateUsers', setUsersCount)
        socketService.on('studentSuccess', onStudentSuccess)
        socketService.on('codeUpdate', handleCodeUpdate)

        return () => {
            socketService.emit('leave', blockId)
            socketService.off('setRole')
            socketService.off('codeUpdate')
            socketService.off('mentorLeft')
            socketService.off('updateUsers')
            socketService.off('studentSuccess')
        }
    }, [blockId])

    const onMentorLeave = () => {
        showAlert({
            title: 'Alert',
            text: 'The mentor has left. Redirecting to the lobby.',
            icon: 'info'
        })
        navigate('/') // Redirect to the lobby
    }

    const onStudentSuccess = () => {
        showAlert({
            title: 'Success!',
            text: 'The student has completed the challenge!',
            icon: 'success'
        })
    }

    const handleCodeChange = (value) => {
        setCode(value)
        socketService.emit('codeChange', { blockId, code: value })
    }

    const handleCodeUpdate = (code) => {
        setMentorCode(code)
    }

    const handleSubmit = () => {
        try {
            if (utilService.evaluateCode(code, block.solution, block.tests)) {
                socketService.emit('challengeSuccess', blockId)
                showAlert({
                    title: 'Success!',
                    text: 'Your solution is correct.',
                    icon: 'success'
                })
                navigate('/')
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
                <div className='code-block-header'>
                    <h1>{block.title} <span className={block.difficulty + ' difficulty-span'}>{block.difficulty}</span></h1>
                    <h3>Instructions:</h3>
                    <p>{block.description}</p>
                </div>
                <div className='flex column align-center'>
                    <div>Welcome {role === 'mentor' ? 'Tom' : 'Student'}!</div>
                    <div>Students: {usersCount - 1}</div>
                </div>
            </div>
            <div className="flex btns-container">
                <button onClick={() => navigate('/')}>Back</button>
                {role === 'student' && <button onClick={handleSubmit}>Submit</button>}
            </div>
            <Editor
                className="editor"
                height="400px"
                width="70%"
                language="javascript"
                value={role === 'mentor' ? mentorCode : code}
                theme="vs-dark"
                onChange={handleCodeChange}
                options={{
                    fontSize: 16,
                    readOnly: role === 'mentor'
                }}
            />
        </section>
    )
}