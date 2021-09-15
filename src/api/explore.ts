import {Session} from "@inrupt/solid-client-authn-browser";
const SolidFileClient = require("solid-file-client");

export const getRootFolder = (provider: string) => {

    return provider.replace("/profile/card#me", "/")

}

export const getFolder = async (folderUrl: string, session: Session) => {

    const fc = new SolidFileClient(session);

    let folderContent = await fc.readFolder(folderUrl);

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

const buildFileUrl = (path: string, fileName: string) => {
    return `${path.concat(fileName)}`;
};

export const uploadFile = async (folder: string, filename: string, contentType: string, content: string, session: Session) => {

    const fc = new SolidFileClient(session);

    const url = buildFileUrl(folder, filename)

    const type = filename.endsWith('.ttl') || filename === "card#me"
        ? 'text/turtle'
        : contentType;

    return await fc.putFile(url, content, type || "text/plain");
};

export const createFile = async (folder: string, filename: string, session: Session) => {
    const fc = new SolidFileClient(session);

    return await fc.createFile(folder+filename, '', filename.endsWith(".ttl") ? "text/turtle" : 'text/plain');
}

export const removeFile = async (uri: string, session: Session) => {
    const fc = new SolidFileClient(session);

    try {
        await fc.delete(uri);
        return {};
    } catch (e) {

    }
};

export const addFriend = async (uri: string, session: Session) => {

    const root = getRootFolder(session.info.webId || "")

    const query = `
    
   INSERT DATA {
        <${session.info.webId}> <http://xmlns.com/foaf/0.1/knows> <${uri}> .
   }
    `;

    await session.fetch(root + 'pr8/friends.ttl', {
        method: 'PATCH',
        body: query,
        headers: {
            'Content-Type': 'application/sparql-update'
        }
    });
}

