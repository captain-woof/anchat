import Head from 'next/head'
import Script from 'next/script'

export default function Pwa() {
    return (
        <>
            <Head>
                <link rel="manifest" href="manifest.json" />
            </Head>
            <Script id="Register SW" dangerouslySetInnerHTML={{
                __html: `
                    if ('serviceWorker' in navigator){
                        navigator.serviceWorker.register('/service-worker.js')
                    }
                `
            }} />
        </>
    )
}