import Head from 'next/head'

export default function MainSeo() {
    return (
        <Head>
            <title>Anchat</title>
            <meta charSet="utf-8" />
            <meta name="title" content="Anchat" />
            <meta name="description" content="A site where you can chat with people from all across the world, or create private chat rooms with your friends." />
            <meta name="keywords" content="penpal, meet people website, chat with people, private chat room, find friends, penpal website" />
            <meta name="author" content="Sohail Saha (captain-woof)" />
            <meta name="robots" content="index, follow" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Anchat" />
            <meta property="og:description" content="A site where you can chat with people from all across the world, or create private chat rooms with your friends." />
            <meta property="og:image" content="/images/landing_page.png" />
            <meta property="og:url" content="https://anchat.vercel.app" />
            <meta property="og:site_name" content="Anchat" />
            <meta name="twitter:title" content="Anchat" />
            <meta name="twitter:description" content="A site where you can chat with people from all across the world, or create private chat rooms with your friends." />
            <meta name="twitter:image" content="/images/landing_page.png" />
            <meta name="twitter:image:alt" content="Anchat - Meet new people, make private chat rooms." />
            <meta name="twitter:site" content="@realCaptainWoof" />
            <meta name="twitter:creator" content="@realCaptainWoof" />
            <meta name="theme-color" content="#ffb01f" />
            <meta name="google-site-verification" content="UNvdFl_8l4GAQdhkkEBQAedGhZ6xZlRWf3kASVbGRj8" />
        </Head>
    )
}