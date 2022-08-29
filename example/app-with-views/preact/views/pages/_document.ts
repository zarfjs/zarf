import type { ComponentChildren } from 'preact'
import { html } from '../utils/html'


interface DocumentProps {
    children: ComponentChildren
    styleTag?: string
}

const Document = ({ children, styleTag }: DocumentProps) =>
    html`
        <html>
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <style>
                ${styleTag}
            </style>
        </head>
        <body id="body" className='no-js'>
            ${children}
            <script>
                document.body.classList.remove("no-js");
                document.body.classList.add("js");
            </script>
        </body>
    <//>`

export default Document
