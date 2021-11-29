import Script from 'next/script'

export default function GoogleAnalytics() {
    return (
        <>
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-83KKW8HX9J" id="ga-1"/>
            <Script id="ga-2" dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-83KKW8HX9J'); 
                `
            }}>
            </Script>
        </>
    )
}