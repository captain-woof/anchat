import { useUser } from "../hooks/user"
import router from 'next/router'
import { useRoom, useRoomSession } from "../hooks/rooms"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Container from "../components/atoms/container"
import InviteDialog from "../components/molecules/dialogs/inviteDialog"
import styles from '../styles/room.module.css'
import { MdPeople as PeopleIcon, MdSend as SendIcon } from 'react-icons/md'
import Image from 'next/image'
import { useMessages } from "../hooks/messages"
import { usePageProgress } from "../hooks/page_progress"
import { useIntersectionRevealer } from "react-intersection-revealer"
import moment from "moment"
import cx from 'classnames'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import RoomSeo from '../components/seo/room'

// To get roomId
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    return ({
        props: {
            roomId: 'roomId' in query ? query.roomId as string : 'NON_EXISTENT_ROOM'
        }
    })
}

// Main page component - /room?roomId=SOMETHING
export default function Room({ roomId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { user, userPending } = useUser()
    useRoomSession(roomId as string)
    const [inviteDialogVisible, setInviteDialogVisible] = useState<boolean>(true)
    const { roomExists, room: { name } } = useRoom(roomId as string)

    /* Redirect to login page if unauthenticated */
    useEffect(() => {
        if (!user && !userPending) {
            router.push(`/login?from=${encodeURIComponent(`/room?roomId=${roomId}`)}`)
        }
    }, [roomId, user, userPending])

    return (
        <>
            <RoomSeo roomName={name}/>
            <Container style={{
                height: 'calc(100vh - var(--height-navbar))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <InviteDialog roomId={roomId as string} roomExists={roomExists} inviteDialogVisible={inviteDialogVisible} setInviteDialogVisible={setInviteDialogVisible} />
                <RoomDetails roomId={roomId as string} setInviteDialogVisible={setInviteDialogVisible} roomExists={roomExists} />
                <MessagesScrollView roomId={roomId as string} roomExists={roomExists} />
                <SendMessageBox roomId={roomId as string} roomExists={roomExists} />
            </Container>
        </>
    )
}

/////////////////////
// Child components
/////////////////////

// Room details
interface IRoomDetails {
    roomId: string
    setInviteDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
    roomExists: boolean
}

function RoomDetails({ roomId, setInviteDialogVisible, roomExists }: IRoomDetails) {
    const { room: { name, numOfActiveUsers } } = useRoom(roomId)

    return (
        <div className={styles.room_details_container} onClick={() => { setInviteDialogVisible(true) }}>
            <div className={styles.room_name}>{roomExists ? name : "Room does not exist!"}</div>
            <div className={styles.room_active_users_num}>
                <PeopleIcon />
                {numOfActiveUsers}
            </div>
        </div>
    )
}

// Message
interface IMessage {
    displayPic: string
    body: string
    senderName: string
    timestamp: number
    own: boolean
}

function Message({ body, displayPic, senderName, timestamp, own }: IMessage) {
    // For alternating between date and time on messages
    const timestampMoment = useMemo(() => moment(timestamp), [timestamp])

    const [timestampFormat, setTimestampFormat] = useState<'Do MMM, YY' | 'h:mm a'>('Do MMM, YY')

    return (
        <figure className={own ? styles.message_container_me : styles.message_container_other} onClick={() => {
            setTimestampFormat(prevFormat => prevFormat === 'Do MMM, YY' ? 'h:mm a' : 'Do MMM, YY')
        }}>
            <div className={styles.display_image_container}>
                <span className={styles.sender_name_first_letter}>{senderName[0]}</span>
                {displayPic && displayPic !== '' &&
                    <Image alt={senderName} src={displayPic} className={styles.sender_display_pic} placeholder='empty' layout='fill' />
                }
            </div>
            <div className={styles.message_meta_container}>
                <span className={styles.message_sender_name}>{senderName}</span>
                <p className={styles.message_body}>{body}</p>
                <span className={styles.message_timestamp}>
                    {timestampMoment.format(timestampFormat)}
                </span>
            </div>
        </figure>
    )
}

// Messages scroll view
interface IMessagesScrollView {
    roomId: string
    roomExists: boolean
}

function MessagesScrollView({ roomId, roomExists }: IMessagesScrollView) {
    // For messages and identifying their senders
    const { messages, loadMoreMsgs, pending: messagesPending } = useMessages(roomId as string, 10, 2)
    const { user } = useUser()
    const { room } = useRoom(roomId)

    // Show indeterminate progress bar while messages load
    const { setProgress } = usePageProgress()
    useEffect(() => {
        setProgress(messagesPending)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messagesPending])

    // Load more messages if user has scrolled all the way to top
    const sentinelLoadMoreMsgs = useRef<HTMLDivElement>(null)
    const { inView: sentinelLoadMoreMsgsInView } = useIntersectionRevealer(sentinelLoadMoreMsgs)
    useEffect(() => {
        if (sentinelLoadMoreMsgsInView) {
            loadMoreMsgs()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sentinelLoadMoreMsgsInView])


    // Auto-Scroll only if user is around the last message and new message arrived
    const sentinelScrollToRef = useRef<HTMLDivElement>(null)
    const messagesScrollViewRef = useRef<HTMLElement>(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const sentinelScrollToY = useMemo(() => sentinelScrollToRef.current?.getBoundingClientRect().y, [sentinelScrollToRef, messages.length, messages[0]?.id])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const messagesScrollViewHeight = useMemo(() => messagesScrollViewRef.current?.getBoundingClientRect().height, [messagesScrollViewRef, messages.length])
    const sentinelScrollToBelowScreenDistance = useMemo(() => ((messagesScrollViewHeight && sentinelScrollToY) ? messagesScrollViewHeight - sentinelScrollToY : 0), [sentinelScrollToY, messagesScrollViewHeight])

    useEffect(() => {
        if (sentinelScrollToBelowScreenDistance <= 0 && sentinelScrollToBelowScreenDistance >= -120) {
            sentinelScrollToRef?.current?.scrollIntoView({ behavior: 'smooth' })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages.length, messages[0]?.id])

    // On first load, scroll to last message in room
    const [firstTimeScrollDone, setFirstTimeScrollDone] = useState<boolean>(false)
    useEffect(() => {
        if (messages.length > 0 && !firstTimeScrollDone) {
            setTimeout(() => {
                sentinelScrollToRef?.current?.scrollIntoView({ behavior: 'smooth' })
                setFirstTimeScrollDone(true)
            }, 500)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages.length, sentinelScrollToRef.current])

    return (
        <section className={cx(styles.messages_scrollview_container, !roomExists && styles.center)} ref={messagesScrollViewRef}>
            {!roomExists
                ? <p>Room does not exist!</p>
                : (
                    <>
                        {/* Load more Sentinel messages */}
                        <div className={styles.sentinel} ref={sentinelLoadMoreMsgs} />

                        {/* Messages */}
                        {messages.map((message) => {
                            if (!!room && !!user && 'usersInRoom' in room && message.senderUid in room.usersInRoom) {
                                const { displayPic, name } = room.usersInRoom[message.senderUid as string]
                                return (
                                    <Message displayPic={displayPic} body={message.body} senderName={name} timestamp={message.timestamp} key={message.id} own={message.senderUid === user.uid} />
                                )
                            } else return null
                        })}

                        {/* Scroll to Sentinel element */}
                        <div className={styles.sentinel} ref={sentinelScrollToRef} />
                    </>
                )
            }
        </section>
    )
}

// Send message box
interface ISendMessageBox {
    roomId: string
    roomExists: boolean
}

function SendMessageBox({ roomId, roomExists }: ISendMessageBox) {
    const [message, setMessage] = useState<string>('')
    const { sendText, userDoc } = useUser()

    const handleSendText = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        sendText && sendText(message.trim(), roomId)
        e.preventDefault()
        setMessage('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message, userDoc])

    return (
        <form className={styles.send_message_box_container} onSubmit={handleSendText}>
            <input className={styles.message_box} value={message} onChange={(e) => { setMessage(e.target.value) }} placeholder="Type your message..." disabled={!roomExists} />
            <button className={styles.send_button_container} disabled={!roomExists || message.trim() === ''} type='submit'>
                <SendIcon className={cx(styles.send_icon, message !== '' ? styles.active : null)} />
            </button>
        </form>
    )
}