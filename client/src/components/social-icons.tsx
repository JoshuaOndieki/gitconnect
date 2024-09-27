import React from 'react';
import {Social} from "@/lib/types";
import {SocialIconGitHub, SocialIconLinkedIn, SocialIconTwitter} from "@/components/social-icon";

const icons = {
    github: (social: Social) => <SocialIconGitHub social={social}/>,
    linkedin: (social: Social) => <SocialIconLinkedIn social={social}/>,
    twitter: (social: Social) => <SocialIconTwitter social={social}/>,
}

function SocialIcons({socials}: {socials: Social[]}) {
    return (
        <ul className="flex space-x-4 sm:mt-0 justify-end">
            {socials.map((social: Social) => (
                <li key={social.$id}>{icons[social.type](social)}</li>
            ))}
        </ul>
    );
}

export default SocialIcons;