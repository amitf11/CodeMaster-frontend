import { BlockList } from "../components/BlockList"

export const Lobby = () => {
    const blocks = [
        {
            _id: '1',
            title: 'test'
        }
    ]

    return (
        <div>
            Lobby
            <BlockList blocks={blocks}/>
        </div>
    )
}