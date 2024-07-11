import { Link } from "react-router-dom"
import { BlockPreview } from "./BlockPreview"

export const BlockList = ({ blocks }) => {

    return (
        <ul>
            {blocks.map((block) => (
                <li key={block._id}>
                    <Link to={`/block/${block._id}`}>
                        <BlockPreview block={block} />
                    </Link>
                </li>
            ))}
        </ul>
    )
}