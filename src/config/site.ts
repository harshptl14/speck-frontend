export const siteConfig = {
    name: 'Speck',
    description: 'Bite sized microlearning platform',
    url: process.env.REDIRECT_URL_FRONTEND || 'http://localhost:3000',
    url_app: process.env.REDIRECT_URL_APP || 'http://localhost:3000',
    ogImage: `${process.env.REDIRECT_URL_FRONTEND}/og-speck.png`,
    // links: {
    //     twitter: 'https://twitter.com/yourhandle',
    //     github: 'https://github.com/yourorg'
    // },
    creator: 'Harsh & Smit'
} as const