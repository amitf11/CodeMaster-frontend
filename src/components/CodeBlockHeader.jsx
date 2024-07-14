export const CodeBlockHeader = ({ role, navigate, block, usersCount, theme, toggleTheme, readOnly, toggleReadOnly, handleSubmit, handleInvite }) => {
    return (
        <>
            <div className='flex space-between'>
                <div className='code-block-header'>
                    <h1>{block.title} <span className={block.difficulty + ' difficulty-span'}>{block.difficulty}</span></h1>
                    <h3>Instructions:</h3>
                    <p>{block.description}</p>
                </div>
                <div className='flex column align-center'>
                    <div>Welcome {role === 'mentor' ? 'Tom' : 'Student'}!</div>
                    <div>Students: {usersCount - 1}</div>
                    {role === 'mentor' && <button  className='invite-btn' onClick={handleInvite}>Invite Students</button>}
                </div>
            </div>
            <div className="flex justify-center btns-container">
                <button onClick={() => navigate('/')}>Back</button>
                <button onClick={toggleTheme}>{theme === 'vs-dark' ? 'Light Mode' : 'Dark Mode'}</button>
                {role === 'mentor' && <button onClick={toggleReadOnly}>
                    {readOnly ? 'Edit Mode' : 'Read-only Mode'}
                </button>}
                {role === 'student' && <button onClick={handleSubmit}>
                    Submit
                </button>}
            </div>
        </>
    )
}