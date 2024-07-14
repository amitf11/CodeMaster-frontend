import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { utilService } from "../services/util.service"
import { blockService } from "../services/block.service"
import { socketService } from "../services/socket.service"

import Editor from "@monaco-editor/react"
import useAlert from "../custom hooks/useAlert"
import { CodeBlockHeader } from "../components/CodeBlockHeader"

export const CodeBlock = () => {
    const [block, setBlock] = useState(null)
    const [role, setRole] = useState('')
    const [code, setCode] = useState('')
    const [theme, setTheme] = useState('vs-dark')
    const [readOnly, setReadOnly] = useState(true)
    const [usersCount, setUsersCount] = useState(0)
    const [mentorCode, setMentorCode] = useState('')

    const navigate = useNavigate()
    const { blockId } = useParams()
    const { showAlert, showConfirmation } = useAlert()

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
        socketService.on('invite', onInvite)
        socketService.on('setRole', setRole)
        socketService.on('mentorLeft', onMentorLeave)
        socketService.on('updateUsers', setUsersCount)
        socketService.on('codeUpdate', handleCodeUpdate) //Could maybe give "setMentorCode" pointer instead as 2nd argument
        socketService.on('studentSuccess', onStudentSuccess)
        
        return () => {
            socketService.emit('leave', blockId)
            socketService.off('invite')
            socketService.off('setRole')
            socketService.off('codeUpdate')
            socketService.off('mentorLeft')
            socketService.off('updateUsers')
            socketService.off('studentSuccess')
        }
    }, [blockId])

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

    const handleInvite = () => {
        socketService.emit('invite', { blockId })
    }

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'vs-dark' ? 'light' : 'vs-dark'))
    }

    const toggleReadOnly = () => {
        setReadOnly((prevReadOnly) => !prevReadOnly)
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
            <CodeBlockHeader
                role={role}
                block={block}
                theme={theme}
                navigate={navigate}
                readOnly={readOnly}
                usersCount={usersCount}
                toggleTheme={toggleTheme}
                handleInvite={handleInvite}
                handleSubmit={handleSubmit}
                toggleReadOnly={toggleReadOnly}
            />
            <Editor
                className="editor"
                height="400px"
                width="70%"
                language="javascript"
                value={role === 'mentor' ? mentorCode : code}
                theme={theme}
                onChange={handleCodeChange}
                options={{
                    fontSize: 16,
                    readOnly: role === 'mentor' && readOnly
                }}
            />
        </section>
    )
}