export const BlockPreview = ({ block }) => {
    return (
        <article className="flex space-between block-preview">
            <div>{block.title}</div>
            <div className={block.difficulty}>{block.difficulty}</div>
        </article>
    )
}