

export default function Lobbies({ userList }) {
    const userMap = userList.map(({ userId, username }) => (
        <li key={userId}>
            {username}
            <button value={userId}>Join</button>
        </li>)
        )

    return (
        <>
            <ul>
                {userMap}
            </ul>
        </>
    )
}