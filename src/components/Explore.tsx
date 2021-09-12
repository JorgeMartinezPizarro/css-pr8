import React, {useEffect, useState} from "react";
import {Session} from "@inrupt/solid-client-authn-browser";

import {createFile, createFolder, getFolder, getRootFolder, removeFile, uploadFile} from "../api/explore";

interface IExploreProps {
    session: Session;
    provider: string;
}

export default (props: IExploreProps) => {

    const [currentFolder, setCurrentFolder] = useState({})

    const [newFolder, setNewFolder] = useState("")

    const [files, setFiles] = useState([]);

    useEffect(() => {
        const root = getRootFolder(props.session.info.webId || "")

        getFolder(root, props.session).then(folder => {
            setCurrentFolder(folder)
            console.log(folder)
        })


    }, [props.session])


    const root = getRootFolder(props.session.info.webId || "")

    return <div>
        <input type="text" placeholder="folder name" value={newFolder} onChange={e => setNewFolder(e.target.value)}/>
        <button onClick = {async () => {
            if (newFolder.endsWith("/")) {
                //@ts-ignore
                await createFolder(currentFolder.folderUrl + newFolder, props.session)
            } else {
                //@ts-ignore
                await createFile(currentFolder.folderUrl, newFolder, props.session);
            }
            //@ts-ignore
            getFolder(currentFolder.folderUrl, props.session).then(folder => {
                setCurrentFolder(folder)
            })
        }} >Create</button>
        <hr/>
        <input type="file" value={files} onChange={async e => {
            //@ts-ignore
            e.target.files.forEach(async file => {
                //@ts-ignore
                await uploadFile(currentFolder.folderUrl, file.name, file.type, file, props.session)
                setFiles([])
                //@ts-ignore
                getFolder(currentFolder.folderUrl, props.session).then(folder => {
                    setCurrentFolder(folder)
                })
            })
        }}/>

        <ul>
            <li>
                {
                    //@ts-ignore
                    currentFolder.folderUrl
                }
            </li>
            {
                //@ts-ignore
                currentFolder.parent !== "https://" && <li>
                    <button onClick={() => {
                        //@ts-ignore
                        getFolder(currentFolder.parent, props.session).then(folder => {
                            setCurrentFolder(folder)
                        })
                    }}>{
                        //@ts-ignore

                        currentFolder.parent
                    }</button>
                </li>
            }
            <li>
                <button onClick={() => {
                    getFolder(root, props.session).then(folder => {
                        setCurrentFolder(folder)
                    })
                }}>{
                    root
                }</button>
            </li>

            {
            //@ts-ignore
            currentFolder.content && currentFolder.content.map(element => {

                if (element.type==="folder") {
                    return <li>
                        <button onClick={() => {
                            getFolder(element.url, props.session).then(folder => {
                                setCurrentFolder(folder)
                            })
                        }}>{element.url}</button>
                        <button onClick={async () => {
                            await removeFile(element.url, props.session);
                            //@ts-ignore
                            getFolder(currentFolder.folderUrl, props.session).then(folder => {
                                setCurrentFolder(folder)
                            })
                        }}>RM</button>
                    </li>
                }
                else {
                    return <li>{element.url}</li>
                }
            })
        }</ul>
    </div>
}
