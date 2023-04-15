import { Folder } from "./Folder"
import { faker } from '@faker-js/faker'

const newFolder = (): Folder => {

    let count = Math.floor(Math.random() * 5)

    const node: Folder = {
        id: faker.datatype.string(5),
        url: faker.internet.url(),
        linkedFolders: [],
        children: [],
        metadata: null,
        isDirectory: false,
        name: faker.system.fileName(),
        path: faker.system.directoryPath(),
        //size: faker.datatype.number({ min: 1, max: 100000 }),
    }

    return node;
}

const roots = [0, 1, 2, 3, 4, 5].map(_ => newFolder()) as Folder[]


let nested = roots.map((folder, i) => {

    if (i % 2 === 0) return folder

    let _new = folder;

    let children = [0, 1, 2].map(_ => newFolder())

    _new.children = children

    _new.isDirectory = true

    if (i == 3) {

        let subfolder = children[0]

        let subchildren = [0, 1].map(_ => newFolder())

        subfolder.children = subchildren

        subfolder.isDirectory = true

    }

    return _new
})

const flattenList = (folder: Folder) => {
    let res = []

    res.push(folder)

    for (let child of folder.children) res = res.concat(flattenList(child))

    return res
}

export const rootFolder = newFolder()

rootFolder.children = nested;

export const flattened = flattenList(rootFolder)