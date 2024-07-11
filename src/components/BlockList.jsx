import { BlockPreview } from "./BlockPreview"

export const BlockList = () => {
    const blocks = [
        {
            title: 'test'
        }
    ]

    return (
        <section>
            BlockList
            {blocks.map((block, idx) => (
                <BlockPreview
                    key={idx}
                    block={block}
                />
            ))}
        </section>
    )
}