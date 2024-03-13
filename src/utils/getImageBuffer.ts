import axios from "axios"

export const getImageBuffer = async (url: string, arraybuffer?: boolean): Promise<Buffer> => {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    return Buffer.from(response.data, 'binary')
}