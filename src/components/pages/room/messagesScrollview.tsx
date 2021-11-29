import styles from './styles.module.css'
import { useMessages } from '../../../hooks/messages'
import { useUser } from '../../../hooks/user'
import { useRoom } from '../../../hooks/rooms'
import Message from './message'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useIntersectionRevealer } from 'react-intersection-revealer'
import Moment from 'moment'
import { usePageProgress } from '../../../hooks/page_progress'
import cx from 'classnames'

interface IMessagesScrollView {
    roomId: string
    roomExists: boolean
}

export default function MessagesScrollView({ roomId, roomExists }: IMessagesScrollView) {

    // For messages and identifying their senders
    const { messages, loadMoreMsgs, pending: messagesPending } = useMessages(roomId as string, 10, 2)
    const { user } = useUser()
    const { room } = useRoom(roomId)

    // Show indeterminate progress bar while messages load
    const { setProgress } = usePageProgress()
    useEffect(() => {
        setProgress(messagesPending)
    }, [messagesPending])

    // For alternating between date and time on messages
    const [timestampFormat, setTimestampFormat] = useState<'Do MMM, YY' | 'h:mm a'>('Do MMM, YY')
    useEffect(() => {
        const intervalHandle = setInterval(() => {
            setTimestampFormat((prevFormat) => prevFormat === 'Do MMM, YY'
                ? 'h:mm a'
                : 'Do MMM, YY'
            )
        }, 8 * 1000)
        return () => { clearInterval(intervalHandle) }
    }, [])

    // Load more messages if user has scrolled all the way to top
    const sentinelLoadMoreMsgs = useRef<HTMLDivElement>(null)
    const { inView: sentinelLoadMoreMsgsInView } = useIntersectionRevealer(sentinelLoadMoreMsgs)
    useEffect(() => {
        if (sentinelLoadMoreMsgsInView) {
            loadMoreMsgs()
        }
    }, [sentinelLoadMoreMsgsInView])


    // Auto-Scroll only if user is around the last message and new message arrived
    const sentinelScrollToRef = useRef<HTMLDivElement>(null)
    const messagesScrollViewRef = useRef<HTMLElement>(null)

    const sentinelScrollToY = useMemo(() => sentinelScrollToRef.current?.getBoundingClientRect().y, [sentinelScrollToRef, messages.length, messages[0]?.id])
    const messagesScrollViewHeight = useMemo(() => messagesScrollViewRef.current?.getBoundingClientRect().height, [messagesScrollViewRef, messages.length])
    const sentinelScrollToBelowScreenDistance = useMemo(() => ((messagesScrollViewHeight && sentinelScrollToY) ? messagesScrollViewHeight - sentinelScrollToY : 0), [sentinelScrollToY, messagesScrollViewHeight])

    useEffect(() => {
        if (sentinelScrollToBelowScreenDistance <= 0 && sentinelScrollToBelowScreenDistance >= -120) {
            sentinelScrollToRef?.current?.scrollIntoView({ behavior: 'smooth' })
        }
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
                                    <Message displayPic={displayPic} body={message.body} senderName={name} displayTimestamp={Moment(message.timestamp).format(timestampFormat)} key={message.id} own={message.senderUid === user.uid} />
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