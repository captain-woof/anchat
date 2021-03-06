import Head from 'next/head'

interface RoomSeo {
    roomName: string
}

export default function RoomSeo({ roomName }: RoomSeo) {
    return (
        <Head>
            <title>{`${roomName} - Anchat`}</title>
            <meta charSet="utf-8" />
            <meta name="title" content={`${roomName} - Anchat`} />
            <meta name="description" content={`Hey, here's your invite to join the room ${roomName} on Anchat`} />
            <meta name="keywords" content="penpal, meet people website, chat with people, private chat room, find friends, penpal website" />
            <meta name="author" content="Sohail Saha (captain-woof)" />
            <meta name="robots" content="index, follow" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`${roomName} - Anchat`} />
            <meta property="og:description" content={`Hey, here's your invite to join the room ${roomName} on Anchat`} />
            <meta property="og:image" content="/images/landing_page.png" />
            <meta property="og:url" content="https://anchat.vercel.app" />
            <meta property="og:site_name" content="Anchat" />
            <meta name="twitter:title" content={`${roomName} - Anchat`} />
            <meta name="twitter:description" content={`Hey, here's your invite to join the room ${roomName} on Anchat`} />
            <meta name="twitter:image" content="/images/landing_page.png" />
            <meta name="twitter:image:alt" content="Anchat - Meet new people, make private chat rooms." />
            <meta name="twitter:site" content="@realCaptainWoof" />
            <meta name="twitter:creator" content="@realCaptainWoof" />
            <meta name="theme-color" content="#ffb01f" />
        </Head>
    )
}