export interface ISurveyMaterial {
    code: string
    groupName: string | null
    name: string
    value: number
    units: string
    dimension: number
    work: {
        finishDate: string
        id: number
        name: string
        startDate: string
    }
}