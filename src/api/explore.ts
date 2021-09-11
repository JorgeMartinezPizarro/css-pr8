import {Session, ISessionInfo} from "@inrupt/solid-client-authn-browser";
const SolidFileClient = require("solid-file-client");

export const getRootFolder = (provider: string) => {

    return provider.replace("/profile/card#me", "/")

}


export const getFolder = async (folderUrl: string, session: Session) => {

    const fc = new SolidFileClient(session);

    let folderContent = await fc.readFolder(folderUrl);

    console.log(folderContent)

    const { name, parent, type, modified, size } = folderContent;

    let folder = {type, name, parent, folderUrl, content:[], size, modified};

    //load subfolders
    for (let subFolder of folderContent.folders) {
        const { name, parent, type, url } = subFolder;
        //@ts-ignore
        folder.content.push({type, name, parent, url, modified, size});
    }

    //load files

    for (let file of folderContent.files) {
        const { name, parent, type, url } = file;
        //@ts-ignore
        folder.content.push({type, name, parent, url, modified, size});
    }

    return folder;
};

export const createFolder = async (folderUrl: string, session: Session) => {

    const fc = new SolidFileClient(session);

    await fc.createFolder(folderUrl);
}
