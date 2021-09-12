import React from "react";
import {Session} from "@inrupt/solid-client-authn-browser";
import Explore from "./Explore"

interface IChatProps {
    session: Session;
    provider: string;
}

export default (props: IChatProps) => {

    return <div>
        <Explore
            session={props.session}
            provider={props.provider}
        />
        <hr/>
    </div>

}
