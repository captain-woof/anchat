import styles from './styles.module.css'
import { MdSend as SendIcon } from 'react-icons/md'
import { useCallback, useState } from 'react'
import cx from 'classnames'
import { useUser } from '../../../hooks/user'

interface ISendMessageBox {
    roomId: string
    roomExists: boolean
}

export default function SendMessageBox({ roomId, roomExists }: ISendMessageBox) {
    const [message, setMessage] = useState<string>('')
    const { sendText, userDoc } = useUser()

    const handleSendText = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        sendText(message, roomId)
        e.preventDefault()
        setMessage('')
    }, [message, userDoc])

    return (
        <form className={styles.send_message_box_container} onSubmit={handleSendText}>
            <input className={styles.message_box} value={message} onChange={(e) => { setMessage(e.target.value) }} placeholder="Type your message..." disabled={!roomExists} />
            <button className={styles.send_button_container} disabled={!roomExists}>
                <SendIcon className={cx(styles.send_icon, message !== '' ? styles.active : null)} />
            </button>
        </form>
    )
}