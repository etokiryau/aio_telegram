export interface ITechnologyStep {
    id: number
    title: string
    templateSrc: string
    src: string
    description: string
}

export interface ITechnologyStepToLoad extends Pick<ITechnologyStep, 'id' | 'description'> {
    templateSrc: Buffer | null
}