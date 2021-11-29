/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react"
import { PageProgressContext } from "../components/providers/page_progress"
import { useUser } from "./user"

interface UsePageProgress {
    progress: boolean
    setProgress: React.Dispatch<React.SetStateAction<boolean>>
}

export const usePageProgress = (): UsePageProgress => {
    const { progress, setProgress } = useContext(PageProgressContext)
    const { userPending } = useUser()

    // Set page progress to true when logging in
    useEffect(() => {
        setProgress(userPending)
    }, [userPending])

    return {
        progress,
        setProgress
    }
}