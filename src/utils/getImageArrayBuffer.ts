import axios from "axios"

export const getImageArrayBuffer = async (url: string): Promise<ArrayBuffer> => {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    return response.data
}