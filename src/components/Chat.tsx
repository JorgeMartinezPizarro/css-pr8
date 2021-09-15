import React, {useEffect, useState} from "react";
import {Session} from "@inrupt/solid-client-authn-browser";
import Explore from "./Explore"
import {addFriend, createFolder, getRootFolder} from "../api/explore";

interface IChatProps {
    session: Session;
    provider: string;
}

export default (props: IChatProps) => {

    const [friend, setFriend] = useState("")

    useEffect(() => {

        const root = getRootFolder(props.session.info.webId || "")

        createFolder(root + "pr8/", props.session).then(console.log).catch(console.error)
    })

    return <div>
        <Explore
            session={props.session}
            provider={props.provider}
        />
        <hr/>
        <input type="text" value={friend} onChange={e => setFriend(e.target.value)}/>
        <button onClick={() => addFriend(friend, props.session)}>CREATE</button>

    </div>

}
