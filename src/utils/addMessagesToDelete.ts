import type { IModelSession } from "../interfaces/session.interface"

export const addMessagesToDelete = async (session: IModelSession | null, messages: number[]) => {
    if (session) {
        const messagesToDelete = session.getDataValue('messagesToDelete')
        
        if (messagesToDelete) {
            try {
                await session.update({ messagesToDelete: [...messagesToDelete, ...messages] })
            } catch (e) { console.log(e) }
        }
    }
}