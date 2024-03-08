export interface ISummaryMaterial {
    name: string
    description: string
    units: string
    dimension: number
    purchased: {
        value: number
        percent: number
    }
    used: {
        value: number
        percent: number
    }
    inProject: {
        value: number
    }
    left: {
        value: number
        percent: number
    }
}