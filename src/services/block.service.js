import { httpService } from "./http.service"

export const blockService = {
    query,
    getById,
    update,
}

function query() {
    return httpService.get('blocks')
}

function getById(blockId) {
    return httpService.get(`blocks/${blockId}`)
}

function update(block) {
    return httpService.put(`blocks/${blockId}`, block)
}