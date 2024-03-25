import axios from 'axios';
import User from '../models/User';
import dotenv from "dotenv"
import type { IProject } from '../interfaces/project.interface';
import type { ISurveyMaterial } from '../interfaces/materials.interface';
import type { IWork } from '../interfaces/work.interface';
import type { ITechnologyStep } from '../interfaces/technologyStep.interface';
import { TUserRoles } from '../interfaces/userRoles.type';

dotenv.config()

const BASE_URL: string = process.env.API_URL ?? '';

type TResponse<T> = { ok: true, data: T } | { ok: false }

const getErrorMessage = (error: unknown): string => {
    let code: string = '';

    if (error && typeof error === 'object' && error.hasOwnProperty('response') &&
        'data' in (error as any).response && !isNaN(Number((error as any).response.data))
    ) {
        code = String((error as any).response.data);
    } else {
        code = '10';
    }

    return code;
};

const getData = async (endpoint: string, token?: string) => {
    try {
        if (token) {
            const response = await axios({ method: 'get', url: `${BASE_URL}${endpoint}`, headers: {
                Authorization: `Bearer ${token}`,
            }})
            // console.log(response.data)
            return response.data
        } else {
            const response = await axios.get(`${BASE_URL}${endpoint}`)
            // console.log(response.data);
            return response.data
        }
    } catch (error) {
        console.log('error message', error)
        throw new Error(getErrorMessage(error))
    }
};

const postData = async (endpoint: string, data: any, token?: string) => {
    try {
        if (token) {
            const response = await axios({ 
                method: 'post', 
                url: `${BASE_URL}${endpoint}`, 
                data, 
                headers: { Authorization: `Bearer ${token}` },
            })
            // console.log(response)
            return response
        } else {
            const response = await axios({ method: 'post', url: `${BASE_URL}${endpoint}`, data })
            // console.log(response)
            return response
        }
    } catch (error) {
        console.log('error message', error)
        throw new Error(getErrorMessage(error))
    }
};

export const handleLogin = async (data: {email: string, password: string, chatId: number }): Promise<TResponse<string>> => {
    try {
        const { email, password, chatId } = data
        const response = await postData('/auth/login', { email, password })

        if (!response.data.emailVerified) {
            return { ok: false }
        } else {
            await User.create({ email, chatId, token: response.data.token })
            return { ok: true, data: response.data.token }
        }
    } catch {
        return { ok: false }
    }
}

export const getProjects = async (token: string): Promise<TResponse<IProject[]>> => {
    try {
        const projectsResp = await getData('/api/GetUserProjects', token)
        return { ok: true, data: projectsResp.projects }
    } catch {
        return { ok: false }
    }
}

export const getUserRoles = async (chatId: number, projectId: number): Promise<TResponse<TUserRoles[]>> => {
    try {
        const user = await User.findOne({ where: { chatId: chatId }})
        if (user) {
            const token = user.getDataValue('token')

            const response = await getData(`/auth/validate?projectId=${projectId}`, token)
            
            return { ok: true, data: response.roles ?? [] }
        } else return { ok: false }
    } catch {
        return { ok: false }
    }
}

export const getMaterials = async (chatId: number, projectId: number, duration: number): Promise<TResponse<ISurveyMaterial[]>> => {
    try {
        const user = await User.findOne({ where: { chatId: chatId }})
        if (user) {
            const token = user.getDataValue('token')

            const from = new Date().toISOString().split('T')[0]
            const toDate = new Date();
            toDate.setDate(toDate.getDate() + duration);
            const to = toDate.toISOString().split('T')[0]

            const materials = await getData(
                `/api/GetRequiredMaterials?projectId=${projectId}&from=${from}&to=${to}`, 
                token
            )
            return { ok: true, data: materials }
        } else return { ok: false }
    } catch {
        return { ok: false }
    }
}

export const getWorks = async (chatId: number, projectId: number, duration: number): Promise<TResponse<IWork[]>> => {
    try {
        const user = await User.findOne({ where: { chatId: chatId }})
        if (user) {
            const token = user.getDataValue('token')
            const date = new Date()
            const start = date.toISOString().split('T')[0]
            const works = await getData(`/api/GetProjectWorksByPeriod?projectId=${projectId}&start=${start}&duration=${duration}`, token)
            return { ok: true, data: works }
        } else return { ok: false }
    } catch {
        return { ok: false }
    }
}

export const getWorkTechSteps = async (chatId: number, workId: number): Promise<TResponse<ITechnologyStep[]>> => {
    try {
        const user = await User.findOne({ where: { chatId: chatId }})
        if (user) {
            const token = user.getDataValue('token')
            const response = await getData(`/api/GetWorkTechSteps?workId=${workId}`,token);
            return { ok: true, data: response.steps }
        } else return { ok: false }
    } catch {
        return { ok: false }
    }
}

export const addWorkComment = async (chatId: number, workId: number, comment: string): Promise<boolean> => {
    try {
        const user = await User.findOne({ where: { chatId: chatId }})
        if (user) {
            const token = user.getDataValue('token')
            await getData(
                `/api/AddWorkComments?workId=${workId}&comment=${comment}`, 
                token
            );
            return true
        } else return false
    } catch {
        return false
    }
}

export const startWork = async (chatId: number, workId: number, date?: string): Promise<boolean> => {
    try {
        const user = await User.findOne({ where: { chatId: chatId }})
        if (user) {
            const token = user.getDataValue('token')

            await getData(
                `/api/StartWork?workId=${workId}${date ? `&date=${date}` : ''}`, 
                token
            )

            return true
        } else return false
    } catch {
        return false
    }
}

export const finishWork = async (chatId: number, workId: number, date?: string): Promise<boolean> => {
    try {
        const user = await User.findOne({ where: { chatId: chatId }})
        if (user) {
            const token = user.getDataValue('token')

            await getData(
                `/api/FinishWork?workId=${workId}${date ? `&date=${date}` : ''}`, 
                token
            )

            return true
        } else return false
    } catch {
        return false
    }
}

export const acceptWork = async (chatId: number, workId: number): Promise<boolean> => {
    try {
        const user = await User.findOne({ where: { chatId: chatId }})
        if (user) {
            const token = user.getDataValue('token')

            await getData(
                `/api/AcceptWork?workId=${workId}`, 
                token
            )
            return true
        } else return false
    } catch {
        return false
    }
}

export const declineWork = async (chatId: number, workId: number, comment: string): Promise<boolean> => {
    try {
        const user = await User.findOne({ where: { chatId: chatId }})
        if (user) {
            const token = user.getDataValue('token')

            await getData(
                `/api/DeclineWork?workId=${workId}&comment=${comment}`, 
                token
            )
            return true
        } else return false
    } catch {
        return false
    }
}

export const loadTempTechStepImage = async (chatId: number, projId: number, workId: number, image: FormData): Promise<boolean> => {
    try {
        const user = await User.findOne({ where: { chatId: chatId }})
        if (user) {
            const token = user.getDataValue('token')
            
            await postData(
                `/api/LoadTempTechStepImage?projId=${projId}&workId=${workId}`,
                image,
                token
            )
            return true
        } else return false
    } catch {
        return false
    }
}