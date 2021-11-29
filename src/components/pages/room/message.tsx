import styles from './styles.module.css'

interface IMessage {
    displayPic: string
    body: string
    senderName: string
    displayTimestamp: string
    own: boolean
}

export default function Message({ body, displayPic, senderName, displayTimestamp, own }: IMessage) {
    return (
        <figure className={own ? styles.message_container_me : styles.message_container_other}>
            <div className={styles.display_image_container}>
                <span className={styles.sender_name_first_letter}>{senderName[0]}</span>
                {displayPic && displayPic !== '' &&
                    <img alt={senderName} src={displayPic} className={styles.sender_display_pic} />
                }
            </div>
            <div className={styles.message_meta_container}>
                <span className={styles.message_sender_name}>{senderName}</span>
                <p className={styles.message_body}>{body}</p>
                <span className={styles.message_timestamp}>{displayTimestamp}</span>
            </div>
        </figure>
    )
}