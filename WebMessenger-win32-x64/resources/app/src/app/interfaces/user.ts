import { status } from './status';

export interface User {
    nick: string
    subnick?: string
    age?: number
    email?: string
    friend?: boolean
    status?: status
    uid: any
    avatar?: string
    friends?: any
}