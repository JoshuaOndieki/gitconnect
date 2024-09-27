import {create} from "zustand";
import {Models} from "appwrite";
import {UserProfile} from "@/lib/types";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";


export interface ZustandState {
    user: UserState | null
    userLoaded: boolean
    hydrated: boolean
    reloadUser: boolean
}

export interface ZustandActions {
    setUser: (user: UserState | null) => void
    setUserLoaded: (loaded: boolean) => void
    setReloadUser: (reload?: boolean | undefined) => void
    setHydrated: () => void
    reset: (keepHydrated?: boolean | undefined) => void
}

export interface UserState extends Models.User<Models.Preferences>, UserProfile {}

const initialState = {
    user: null,
    userLoaded: false,
    hydrated: false,
    reloadUser: false,
}

const useGitConnectStore = create<ZustandState & ZustandActions>()(
    persist(
        immer(
            (set) => ({
                ...initialState,
                setUser: (user) => set(() => ({user})),
                setUserLoaded: (loaded = true) => set(() => ({userLoaded: loaded})),
                setHydrated: ()=> set({hydrated: true}),
                reset: (keepHydrated = true)=> set({...initialState, hydrated: keepHydrated}),
                setReloadUser: (reload = true ) => set({reloadUser: reload}),
            })
        ),
        {
            name: 'gitconnect-store',
            onRehydrateStorage(){
                return (state, error) => {
                    if (!error) state?.setHydrated()
                }
            }
        }
    )
)

export default useGitConnectStore
