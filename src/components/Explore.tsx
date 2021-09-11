import React, {useEffect, useState} from "react";
import {Session, ISessionInfo} from "@inrupt/solid-client-authn-browser";

import {createFolder, getFolder, getRootFolder} from "../api/explore";

interface IExploreProps {
    session: Session;
    provider: string;
}

export default (props: IExploreProps) => {

    const [currentFolder, setCurrentFolder] = useState({})

    const [newFolder, setNewFolder] = useState("")


    useEffect(() => {
        const root = getRootFolder(props.session.info.webId || "")

        getFolder(root, props.session).then(folder => {
            setCurrentFolder(folder)
            console.log(folder)
        })


    }, [])


    const root = getRootFolder(props.session.info.webId || "")

    return <div>
        <input type="text" placeholder="folder name" value={newFolder} onChange={e => setNewFolder(e.target.value)}/>
        <button onClick = {async () => {
            //@ts-ignore
            await createFolder(currentFolder.folderUrl + newFolder, props.session)
            //@ts-ignore
            getFolder(currentFolder.folderUrl, props.session).then(folder => {
                setCurrentFolder(folder)
            })
        }} >Create</button>



        <ul>
            <li>
                <button onClick={() => {
                    getFolder(root, props.session).then(folder => {
                        setCurrentFolder(folder)
                    })
                }}>{root}</button>
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
                    </li>
                }
                else {
                    return <li>{element.url}</li>
                }
            })
        }</ul>
    </div>
}
