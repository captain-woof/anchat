import { createContext, ReactNode, useState } from "react"

interface IPageProgress {
    progress: boolean
    setProgress: any
}

export const PageProgressContext = createContext<IPageProgress>({
    progress: false,
    setProgress: null
})

export default function PageProgressProvider({ children }: { children: ReactNode }) {
    const [progress, setProgress] = useState<boolean>(false)   

    return (
        <PageProgressContext.Provider value={{ progress, setProgress }}>
            {children}
        </PageProgressContext.Provider>
    )
}