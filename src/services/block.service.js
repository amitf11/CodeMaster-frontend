import { httpService } from "./http.service"

export const blockService = {
    query,
    getById,
}

function query() {
    return httpService.get('blocks')
}

function getById(blockId) {
    return httpService.get(`blocks/${blockId}`)
}