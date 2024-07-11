import { httpService } from "./http.service"

export const blockService = {
    query,
    getById,
    update,
}

function query() {
    return httpService.get('block')
}

function getById(blockId) {
    return httpService.get(`block/${blockId}`)
}

function update(block) {
    return httpService.put(`block/${blockId}`, block)
}